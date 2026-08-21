import React from "react";
import { THEME_EARTH } from "./kit/premium/theme";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { CineShot } from "./scenes/CineShot";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

/** Inserto animado: el clip a sangre, corte duro (sin opacidad: con el avatar
 *  cortando duro debajo, un fade dejaria asomar el fondo). */
const ClipShot: React.FC<{ durationInFrames: number; src: string }> = ({ src }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#171310" }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);
import { HookCaption, BeforeAfter, FramedPhoto, BulletCascade, PhotoCarousel, CutawayCallouts, VsDuel, HighlightSweep, MythTruth, CycleLoop, KaraokePhrase, StampBadge, BigStatReveal, SplitPanel, NumberedSteps, FloatingCutout, DonutPercent, DuelColumns, clipRaw, TierRanking, ChecklistReveal, PullQuote, FlowSteps, ChapterTitle, RankBars, CtaCard, LayerStack } from "./kit/premium";

// GENERADO por build_moho.mjs — no editar a mano.
export type Cue = { key: string; start: number; dur: number; fade: boolean; z: number; sfx: string | null; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "s0", start: 0.067, dur: 5.467, fade: false, z: 10,
    sfx: "sfx/lib/impact_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={164} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={164} theme={THEME_EARTH} {...({"words":[{"text":"Ese moho"},{"text":"que limpiaste"},{"text":"YA VOLVIÓ","boxed":true}],"sub":"Y volvió más grande."} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s1", start: 5.533, dur: 5.867, fade: false, z: 11,
    sfx: "sfx/lib/swish_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={176} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={176} theme={THEME_EARTH} {...({"eyebrow":"Lo que me escriben","beforeLabel":"Con cloro","afterLabel":"Tres semanas después","beforeImage":"img/moho_rincon_blanqueado.png","afterImage":"img/moho_rincon_volvio.png","caption":"Volvió más oscura"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s2", start: 11.000, dur: 2.333, fade: true, z: 12,
    sfx: "sfx/lib/click_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={70} src="img/moho_tomas_celular_foto.png" />
    ) },
  { key: "s4", start: 15.867, dur: 5.567, fade: false, z: 14,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={167} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={167} theme={THEME_EARTH} {...({"image":"img/moho_tomas_linterna_rincon.png","caption":"Mismo rincón otra vez","sub":"Más oscura que antes","kenburns":true,"push":0.45,"captionAt":2.69,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s6", start: 24.733, dur: 7.400, fade: false, z: 16,
    sfx: "sfx/lib/page_flip_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={222} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={222} theme={THEME_EARTH} {...({"eyebrow":"Que quede claro","bullets":[{"pre":"No es que ","key":"limpies mal"},{"pre":"No es que seas ","key":"descuidado"},{"pre":"No es que tu casa sea ","key":"vieja"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s7", start: 32.133, dur: 4.133, fade: false, z: 17,
    sfx: "sfx/lib/sub_drop_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={124} src="img/moho_tomas_frente_mancha.png" />
    ) },
  { key: "s9", start: 40.000, dur: 4.767, fade: false, z: 19,
    sfx: "sfx/lib/light_pass_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_tomas_pedazo_revoque.png" />
    ) },
  { key: "s10", start: 44.367, dur: 2.800, fade: true, z: 20,
    sfx: "sfx/lib/transition_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={84} src="img/moho_macro_aterciopelado.png" />
    ) },
  { key: "s11", start: 46.767, dur: 5.267, fade: true, z: 21,
    sfx: "sfx/lib/card_slide_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={158} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={158} theme={THEME_EARTH} {...({"title":"El mismo hongo","shutter":true,"items":[{"image":"img/moho_pan_olvidado.png","label":"El pan olvidado"},{"image":"img/moho_tronco_caido.png","label":"El tronco caído"},{"image":"img/moho_rincon_pared_pariente.png","label":"Tu pared"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s13", start: 54.700, dur: 9.200, fade: false, z: 23,
    sfx: "sfx/lib/whoosh_glass_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={276} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={276} theme={THEME_EARTH} {...({"eyebrow":"Adentro de la pared","title":"Tiene dos partes","image":"img/moho_corte_pared_micelio.png","callouts":[{"text":"La flor","sub":"Fabrica esporas","tx":0.34,"ty":0.24,"side":"left"},{"text":"La raíz","sub":"El micelio","tx":0.58,"ty":0.68,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s15", start: 67.467, dur: 2.833, fade: false, z: 25,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={85} src="img/moho_tomas_palma_pared.png" />
    ) },
  { key: "s16", start: 70.300, dur: 6.200, fade: false, z: 26,
    sfx: "sfx/lib/impact_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={186} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={186} theme={THEME_EARTH} {...({"eyebrow":"Cuestión de escala","title":"El micelio","left":{"label":"Cabello","sub":"0,07 mm","image":"img/moho_macro_cabello.png","value":"70","unit":"µm"},"right":{"label":"Micelio","sub":"0,002 mm","image":"img/moho_macro_filamentos_micelio.png","value":"2","unit":"µm"}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s17", start: 76.533, dur: 10.767, fade: false, z: 27,
    sfx: "sfx/lib/whoosh_glass_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={323} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={323} theme={THEME_EARTH} {...({"image":"img/moho_corte_profundidad_mm.png","caption":"Hasta 5 mm adentro","sub":"Pintura, yeso, revoque","kenburns":true,"push":0.45,"captionAt":5.2,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s19", start: 90.100, dur: 5.500, fade: false, z: 29,
    sfx: "sfx/lib/light_pass_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={165} zone="top" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={165} theme={THEME_EARTH} {...({"pre":"Esa red es ","highlight":"la raíz","post":" que come y crece","note":"Arriba solo está la flor"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s20", start: 95.600, dur: 2.700, fade: false, z: 30,
    sfx: "sfx/lib/swish_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={81} src="img/moho_tomas_trapo_balde.png" />
    ) },
  { key: "s21", start: 98.300, dur: 6.367, fade: false, z: 31,
    sfx: "sfx/lib/boom_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={191} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={191} theme={THEME_EARTH} {...({"myth":"Limpiaste el moho","truth":"Limpiaste solo la flor"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s23", start: 108.767, dur: 8.067, fade: false, z: 33,
    sfx: "sfx/lib/whoosh_reverse_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={242} zone="full" theme={THEME_EARTH}>
        <CycleLoop durationInFrames={242} theme={THEME_EARTH} {...({"title":"El ciclo que nunca corta","center":"Vuelve","nodes":[{"label":"Limpiás la flor"},{"label":"Queda la raíz"},{"label":"Llega la humedad"},{"label":"Vuelve la mancha"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s24", start: 116.800, dur: 2.800, fade: false, z: 34,
    sfx: "sfx/lib/tap_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={84} src="img/moho_tomas_senala_rincon.png" />
    ) },
  { key: "s25", start: 119.600, dur: 4.900, fade: false, z: 35,
    sfx: "sfx/lib/chime_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={147} zone="top" theme={THEME_EARTH}>
        <KaraokePhrase durationInFrames={147} theme={THEME_EARTH} {...({"eyebrow":"Por eso","phrase":"Siempre el rincón, nunca el medio","wordDur":0.5} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s27", start: 129.367, dur: 5.967, fade: false, z: 37,
    sfx: "sfx/lib/impact_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={179} zone="full" theme={THEME_EARTH}>
        <StampBadge durationInFrames={179} theme={THEME_EARTH} {...({"text":"PARTE EQUIVOCADA","sub":"Todo lo que compraste falló","x":0.62,"y":0.4} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s28", start: 135.300, dur: 2.367, fade: false, z: 38,
    sfx: "sfx/lib/pop_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={71} src="img/moho_tomas_dos_botellas.png" />
    ) },
  { key: "s29", start: 137.667, dur: 5.333, fade: false, z: 39,
    sfx: "sfx/lib/coin_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={160} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={160} theme={THEME_EARTH} {...({"eyebrow":"Las dos cosas juntas","value":"2","prefix":"$","suffix":"","support":"en cualquier supermercado","source":"Sin marca"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s31", start: 148.333, dur: 7.867, fade: false, z: 41,
    sfx: "sfx/lib/page_flip_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={236} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={236} theme={THEME_EARTH} {...({"eyebrow":"Química simple","title":"La usan los restauradores","image":"img/moho_restaurador_cal_muro.png","bullets":["De casas de 100 años","Nadie te la explica clarita"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s33", start: 158.667, dur: 7.967, fade: false, z: 43,
    sfx: "sfx/lib/count_tick_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={239} zone="left" theme={THEME_EARTH}>
        <NumberedSteps durationInFrames={239} theme={THEME_EARTH} {...({"eyebrow":"Lo que viene","title":"En este video","steps":[{"title":"Cuánto tiempo","image":"img/moho_reloj_cocina_pared.png"},{"title":"En qué orden","image":"img/moho_envases_en_fila.png"},{"title":"Qué se salva","image":"img/moho_muestras_materiales.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s36", start: 175.733, dur: 6.333, fade: false, z: 46,
    sfx: "sfx/lib/riser_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={190} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={190} theme={THEME_EARTH} {...({"words":[{"text":"Hay un error"},{"text":"UNO SOLO","boxed":true},{"text":"que lo trae de vuelta"}],"sub":"Aunque hagas todo perfecto"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s38", start: 186.867, dur: 4.767, fade: false, z: 48,
    sfx: "sfx/lib/swish_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_fill_rodillo_pintura_trabajo_terminado.png" />
    ) },
  { key: "s39", start: 191.633, dur: 5.200, fade: false, z: 49,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={156} src="img/moho_tomas_corre_cama_hija.png" />
    ) },
  { key: "s40", start: 196.833, dur: 5.433, fade: false, z: 50,
    sfx: "sfx/lib/sub_drop_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={163} src="img/moho_fill_pared_cuarto_hija_parche_repintado.png" />
    ) },
  { key: "s41", start: 202.267, dur: 4.933, fade: false, z: 51,
    sfx: "sfx/lib/tick_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={148} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={148} theme={THEME_EARTH} {...({"eyebrow":"El error","bullets":[{"pre":"No es ","key":"limpiar mal"},{"pre":"No es ","key":"poco producto"},{"pre":"Es ","key":"otra cosa"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s42", start: 207.233, dur: 5.200, fade: false, z: 52,
    sfx: "sfx/lib/tap_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={156} src="img/moho_fill_bolsa_plastico_cinta_lista.png" />
    ) },
  { key: "s43", start: 212.433, dur: 7.267, fade: false, z: 53,
    sfx: "sfx/lib/pop_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={218} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={218} theme={THEME_EARTH} {...({"image":"img/moho_bolsa_cinta_recorte.png","label":"La prueba de la bolsa","sub":"Dos minutos, bolsa y cinta"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s44", start: 219.700, dur: 5.533, fade: false, z: 54,
    sfx: "sfx/lib/click_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={166} src="img/moho_tomas_pega_bolsa.png" />
    ) },
  { key: "s45", start: 225.233, dur: 5.200, fade: false, z: 55,
    sfx: "sfx/lib/tick_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={156} src="img/moho_fill_botella_lejia_piso_bano.png" />
    ) },
  { key: "s46", start: 230.467, dur: 5.567, fade: false, z: 56,
    sfx: "sfx/lib/card_slide_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={167} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={167} theme={THEME_EARTH} {...({"title":"Como le digas","shutter":true,"items":[{"image":"img/moho_botella_cloro_1.png","label":"Cloro"},{"image":"img/moho_botella_cloro_2.png","label":"Lejía"},{"image":"img/moho_botella_cloro_3.png","label":"Lavandina"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s47", start: 236.033, dur: 3.167, fade: false, z: 57,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={95} src="img/moho_x_bolsa_plastico_cinta.png" />
    ) },
  { key: "s48", start: 239.167, dur: 3.433, fade: false, z: 58,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={103} src="img/moho_x_envases_limpieza_alineados.png" />
    ) },
  { key: "s49", start: 242.600, dur: 6.733, fade: false, z: 59,
    sfx: "sfx/lib/sub_drop_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={202} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={202} theme={THEME_EARTH} {...({"myth":"El cloro mata el moho","truth":"El cloro es un blanqueador"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s50", start: 249.333, dur: 8.567, fade: false, z: 60,
    sfx: "sfx/lib/whoosh_glass_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={257} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={257} theme={THEME_EARTH} {...({"eyebrow":"Lo que hace el cloro","title":"Rompe el pigmento","image":"img/moho_macro_melanina_negro.png","callouts":[{"text":"Melanina","sub":"El pigmento negro","tx":0.38,"ty":0.3,"side":"left"},{"text":"Solo el color","sub":"No el ser vivo","tx":0.62,"ty":0.66,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s51", start: 257.900, dur: 3.567, fade: false, z: 61,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={107} src="img/moho_x_botella_lavandina_bajo_pileta.png" />
    ) },
  { key: "s52", start: 261.467, dur: 6.900, fade: false, z: 62,
    sfx: "sfx/lib/spritz_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={207} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={207} theme={THEME_EARTH} {...({"eyebrow":"Delante de tus ojos","beforeLabel":"Con la mancha","afterLabel":"30 segundos después","beforeImage":"img/moho_azulejo_mancha_antes.png","afterImage":"img/moho_azulejo_mancha_despues.png","caption":"Blanca, no muerta"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s53", start: 268.367, dur: 3.167, fade: false, z: 63,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={95} src="img/moho_x_rociador_spray_pared.png" />
    ) },
  { key: "s54", start: 271.533, dur: 7.467, fade: false, z: 64,
    sfx: "sfx/lib/impact_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={224} zone="full" theme={THEME_EARTH}>
        <StampBadge durationInFrames={224} theme={THEME_EARTH} {...({"text":"NO ESTÁ MUERTO","sub":"Está transparente","x":0.58,"y":0.38} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s55", start: 278.967, dur: 7.067, fade: false, z: 65,
    sfx: "sfx/lib/key_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={212} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={212} theme={THEME_EARTH} {...({"image":"img/moho_corte_blanqueado_raiz.png","caption":"La raíz sigue ahí","sub":"Intacta, adentro del poro","kenburns":true,"push":0.45,"captionAt":3,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s56", start: 286.067, dur: 4.567, fade: false, z: 66,
    sfx: "sfx/lib/tick_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={137} src="img/moho_fill_botella_traslucida_contraluz_agua.png" />
    ) },
  { key: "s57", start: 290.633, dur: 5.733, fade: false, z: 67,
    sfx: "sfx/lib/click_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={172} src="img/moho_tomas_botella_lavadero.png" />
    ) },
  { key: "s58", start: 296.367, dur: 6.933, fade: false, z: 68,
    sfx: "sfx/lib/pour_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={208} zone="full" theme={THEME_EARTH}>
        <DonutPercent durationInFrames={208} theme={THEME_EARTH} {...({"value":95,"title":"De la botella es agua","support":"El hipoclorito es una fracción mínima"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s59", start: 303.300, dur: 2.967, fade: false, z: 69,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={89} src="img/moho_x_liquido_escurre_pared.png" />
    ) },
  { key: "s60", start: 306.233, dur: 6.733, fade: false, z: 70,
    sfx: "sfx/lib/ui_select_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={202} zone="full" theme={THEME_EARTH}>
        <DuelColumns durationInFrames={202} theme={THEME_EARTH} {...({"title":"Qué entra en el poro","leftName":"Hipoclorito","rightName":"Agua","rows":[{"attr":"Tiene carga","leftWins":true},{"attr":"Entra al poro","leftWins":false},{"attr":"Se queda arriba","leftWins":true}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s61", start: 312.967, dur: 3.233, fade: false, z: 71,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={97} src="img/moho_x_pared_blanqueada_halo.png" />
    ) },
  { key: "s62", start: 316.200, dur: 6.100, fade: false, z: 72,
    sfx: "sfx/lib/droplet_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={183} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={183} theme={THEME_EARTH} {...({"eyebrow":"Adentro del poro","title":"Arriba y adentro","image":"img/moho_macro_gota_poro.png","callouts":[{"text":"El ion rebota","tx":0.33,"ty":0.28,"side":"left"},{"text":"El agua entra","tx":0.6,"ty":0.7,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s63", start: 322.300, dur: 5.700, fade: false, z: 73,
    sfx: "sfx/lib/whoosh_reverse_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={171} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={171} theme={THEME_EARTH} {...({"words":[{"text":"Le dejaste"},{"text":"el veneno arriba"},{"text":"Y EL AGUA ADENTRO","boxed":true}],"sub":"Le regaste la raíz"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s64", start: 328.000, dur: 5.667, fade: false, z: 74,
    sfx: "sfx/lib/splash_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={170} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={170} theme={THEME_EARTH} {...({"image":"img/moho_chorro_escurre_pared.png","caption":"Le regaste la raíz","sub":"Literalmente","kenburns":true,"push":0.45,"captionAt":2.2} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s65", start: 333.667, dur: 2.900, fade: false, z: 75,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={87} src="img/moho_x_macro_poro_revoque.png" />
    ) },
  { key: "s66", start: 336.533, dur: 6.700, fade: false, z: 76,
    sfx: "sfx/lib/glass_ting_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={201} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={201} theme={THEME_EARTH} {...({"myth":"Es una impresión mía","truth":"Le diste de comer"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s67", start: 343.233, dur: 2.567, fade: false, z: 77,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={77} src="vid/moho_x_agua_cae_balde.mp4" />
    ) },
  { key: "s68", start: 345.800, dur: 7.667, fade: false, z: 78,
    sfx: "sfx/lib/confirm_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={230} zone="full" theme={THEME_EARTH}>
        <TierRanking durationInFrames={230} theme={THEME_EARTH} {...({"title":"Dónde sirve el cloro","rows":[{"tier":"SÍ","items":["Azulejo vidriado","Vidrio","Plástico liso"]},{"tier":"NO","items":["Junta","Revoque","Madera","Yeso"]}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s69", start: 353.467, dur: 3.033, fade: false, z: 79,
    sfx: "sfx/lib/tap_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_tomas_dedo_junta.png" />
    ) },
  { key: "s70", start: 356.467, dur: 5.100, fade: false, z: 80,
    sfx: "sfx/lib/impact_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={153} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={153} theme={THEME_EARTH} {...({"eyebrow":"La misma pared","title":"Baldosa o junta","left":{"label":"Baldosa","sub":"Superficie","image":"img/moho_macro_azulejo_vidriado.png","good":true},"right":{"label":"Junta","sub":"Poro","image":"img/moho_macro_junta_negra.png","good":false}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s71", start: 361.567, dur: 2.967, fade: false, z: 81,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={89} src="img/moho_x_agua_absorbe_ladrillo.png" />
    ) },
  { key: "s72", start: 364.533, dur: 8.033, fade: false, z: 82,
    sfx: "sfx/lib/count_tick_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={241} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={241} theme={THEME_EARTH} {...({"title":"Casi toda tu casa","items":["La pared","El revoque","El techo","La madera","El yeso","La silicona vieja"],"stamp":"TODO POROSO"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s73", start: 372.567, dur: 2.467, fade: false, z: 83,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={74} src="img/moho_x_mancha_volvio_oscura.png" />
    ) },
  { key: "s74", start: 375.033, dur: 4.767, fade: false, z: 84,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_tomas_puerta_cuarto.png" />
    ) },
  { key: "s75", start: 379.367, dur: 5.667, fade: true, z: 85,
    sfx: "sfx/lib/key_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={170} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={170} theme={THEME_EARTH} {...({"image":"img/moho_pared_patio_sin_sol.png","caption":"La pared que da al patio","sub":"La que nunca ve el sol","kenburns":true,"push":0.45,"captionAt":2.6,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s76", start: 385.067, dur: 5.167, fade: false, z: 86,
    sfx: "sfx/lib/sub_drop_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={155} src="img/moho_fill_mancha_atras_cabecera_cama.png" />
    ) },
  { key: "s77", start: 390.233, dur: 3.833, fade: false, z: 87,
    sfx: "sfx/lib/splash_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={115} src="img/moho_tomas_limpia_cloro_cuarto.png" />
    ) },
  { key: "s78", start: 394.067, dur: 5.667, fade: false, z: 88,
    sfx: "sfx/lib/swish_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={170} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={170} theme={THEME_EARTH} {...({"eyebrow":"Cinco semanas","beforeLabel":"Una mano","afterLabel":"Dos manos","beforeImage":"img/moho_mancha_una_mano.png","afterImage":"img/moho_mancha_dos_manos.png","caption":"Creció al doble"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s79", start: 399.733, dur: 2.433, fade: false, z: 89,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={73} src="vid/moho_x_gotas_resbalan_azulejo.mp4" />
    ) },
  { key: "s80", start: 402.167, dur: 6.033, fade: false, z: 90,
    sfx: "sfx/lib/page_flip_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={181} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={181} theme={THEME_EARTH} {...({"eyebrow":"La ferretería","title":"La pintura antihongos","image":"img/moho_lata_pintura_pincel.png","bullets":["Me lo juraron","Quedó preciosa"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s81", start: 408.200, dur: 4.967, fade: false, z: 91,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={149} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={149} theme={THEME_EARTH} {...({"image":"img/moho_anillo_borde_pintado.png","caption":"Salió por el borde","sub":"Un anillo alrededor","kenburns":true,"push":0.45,"captionAt":2.3} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s82", start: 413.167, dur: 2.800, fade: false, z: 92,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={84} src="img/moho_x_silicona_bano_negra.png" />
    ) },
  { key: "s84", start: 417.200, dur: 5.733, fade: false, z: 94,
    sfx: "sfx/lib/boom_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={172} src="img/moho_tomas_sentado_piso.png" />
    ) },
  { key: "s85", start: 422.933, dur: 5.767, fade: false, z: 95,
    sfx: "sfx/lib/soil_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={173} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={173} theme={THEME_EARTH} {...({"image":"img/moho_manos_cal_balde.png","label":"Un albañil viejo","sub":"Toda la vida con cal"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s86", start: 428.700, dur: 4.600, fade: false, z: 96,
    sfx: "sfx/lib/tap_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={138} src="img/moho_fill_balde_cal_muro_antiguo.png" />
    ) },
  { key: "s87", start: 433.300, dur: 2.933, fade: false, z: 97,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={88} src="img/moho_x_cabecera_cama_corrida.png" />
    ) },
  { key: "s88", start: 436.200, dur: 8.300, fade: false, z: 98,
    sfx: "sfx/lib/bell_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={249} zone="full" theme={THEME_EARTH}>
        <PullQuote durationInFrames={249} theme={THEME_EARTH} {...({"quote":"No tienes suciedad. Tienes agua.","author":"El albañil","role":"El hongo es el síntoma","image":"img/moho_retrato_albanil_viejo.png"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s89", start: 444.533, dur: 2.567, fade: false, z: 99,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={77} src="img/moho_x_anillo_moho_borde_pintura.png" />
    ) },
  { key: "s90", start: 447.100, dur: 7.967, fade: false, z: 100,
    sfx: "sfx/lib/chime_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={239} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={239} theme={THEME_EARTH} {...({"title":"Necesita tres cosas","nodes":[{"label":"Comida","sub":"Ya la tiene","image":"img/moho_polvo_yeso_comida.png"},{"label":"Temperatura","sub":"La tuya","image":"img/moho_termometro_pared_interior.png"},{"label":"Agua","sub":"La que puedes sacar","image":"img/moho_condensacion_vidrio_ventana.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s91", start: 455.033, dur: 2.633, fade: false, z: 101,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={79} src="img/moho_x_cal_se_disuelve_balde.png" />
    ) },
  { key: "s92", start: 457.667, dur: 10.400, fade: false, z: 102,
    sfx: "sfx/lib/card_slide_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={312} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={312} theme={THEME_EARTH} {...({"title":"El menú","shutter":true,"items":[{"image":"img/moho_polvo_zocalo_dedo.png","label":"Polvo"},{"image":"img/moho_papel_yeso_despegado.png","label":"Papel del yeso"},{"image":"img/moho_madera_veta_humeda.png","label":"Madera"},{"image":"img/moho_grasa_azulejo_cocina.png","label":"Grasa de cocina"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s93", start: 468.100, dur: 5.633, fade: false, z: 103,
    sfx: "sfx/lib/tap_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={169} src="img/moho_fill_menu_del_hongo_bodegon_cenital.png" />
    ) },
  { key: "s94", start: 473.733, dur: 7.200, fade: false, z: 104,
    sfx: "sfx/lib/shimmer_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={216} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={216} theme={THEME_EARTH} {...({"eyebrow":"La temperatura","title":"Le gusta la misma que a ti","image":"img/moho_living_tibio_estufa.png","bullets":["Por eso vive adentro","Y no afuera en la nieve"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s95", start: 480.933, dur: 2.633, fade: false, z: 105,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={79} src="img/moho_x_humedad_difusa_pared.png" />
    ) },
  { key: "s96", start: 483.567, dur: 4.700, fade: false, z: 106,
    sfx: "sfx/lib/ding_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={141} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={141} theme={THEME_EARTH} {...({"eyebrow":"Te queda una sola","value":"1","prefix":"","suffix":" pata","support":"El agua","source":"Sácala y se muere solo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s97", start: 488.233, dur: 4.967, fade: false, z: 107,
    sfx: "sfx/lib/tap_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={149} src="img/moho_fill_estante_productos_sin_etiqueta.png" />
    ) },
  { key: "s98", start: 493.200, dur: 4.767, fade: false, z: 108,
    sfx: "sfx/lib/tick_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_fill_macro_gota_condensacion_pared.png" />
    ) },
  { key: "s99", start: 497.967, dur: 5.067, fade: false, z: 109,
    sfx: "sfx/lib/whoosh_reverse_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={152} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={152} theme={THEME_EARTH} {...({"number":"II","title":"El agua invisible","sub":"Por qué el mismo rincón"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s100", start: 503.033, dur: 6.167, fade: false, z: 110,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={185} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={185} theme={THEME_EARTH} {...({"image":"img/moho_haz_luz_particulas_aire.png","caption":"El aire tiene agua","sub":"Siempre, aunque no la veas","kenburns":true,"push":0.45,"captionAt":2.6} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s101", start: 509.200, dur: 9.233, fade: false, z: 111,
    sfx: "sfx/lib/droplet_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={277} zone="left" theme={THEME_EARTH}>
        <NumberedSteps durationInFrames={277} theme={THEME_EARTH} {...({"eyebrow":"De dónde sale","title":"El agua de tu casa","steps":[{"title":"Respirar de noche","image":"img/moho_cama_noche_respiracion.png"},{"title":"La ducha","image":"img/moho_bano_vapor_ducha.png"},{"title":"La olla","image":"img/moho_olla_hirviendo_vapor.png"},{"title":"La ropa tendida","image":"img/moho_ropa_tendida_adentro.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s102", start: 518.433, dur: 5.767, fade: false, z: 112,
    sfx: "sfx/lib/count_tick_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={173} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={173} theme={THEME_EARTH} {...({"eyebrow":"Una familia de cuatro","value":"10","prefix":"","suffix":" litros","support":"de agua al aire por día","source":"En tu propia casa"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s103", start: 524.200, dur: 5.667, fade: false, z: 113,
    sfx: "sfx/lib/tap_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={170} src="img/moho_fill_olla_hirviendo_vapor_cocina.png" />
    ) },
  { key: "s104", start: 529.833, dur: 6.533, fade: false, z: 114,
    sfx: "sfx/lib/squish_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={196} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={196} theme={THEME_EARTH} {...({"image":"img/moho_esponja_empapada_recorte.png","label":"El aire tibio es una esponja","sub":"Cuanto más caliente, más agua"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s105", start: 536.367, dur: 5.767, fade: false, z: 115,
    sfx: "sfx/lib/transition_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={173} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={173} theme={THEME_EARTH} {...({"title":"Qué pasa al tocar lo frío","nodes":[{"label":"Aire tibio","image":"img/moho_aire_tibio_vapor_cuarto.png"},{"label":"Pared fría","image":"img/moho_pared_fria_esquina.png"},{"label":"Suelta agua","image":"img/moho_gotas_condensadas_pared.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s106", start: 542.133, dur: 4.900, fade: false, z: 116,
    sfx: "sfx/lib/splash_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={147} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={147} theme={THEME_EARTH} {...({"image":"img/moho_vaso_suda_verano.png","caption":"El vaso que suda","sub":"Tu pared es ese vaso","kenburns":true,"push":0.45,"captionAt":2.7,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s107", start: 547.033, dur: 7.933, fade: false, z: 117,
    sfx: "sfx/lib/whoosh_glass_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={238} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={238} theme={THEME_EARTH} {...({"eyebrow":"Puntos fríos","title":"Dónde está tu vaso","image":"img/moho_habitacion_puntos_frios.png","callouts":[{"text":"El rincón exterior","tx":0.2,"ty":0.18,"side":"left"},{"text":"Detrás del ropero","tx":0.72,"ty":0.55,"side":"right"},{"text":"El marco","tx":0.45,"ty":0.4,"side":"left"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s108", start: 554.967, dur: 3.267, fade: false, z: 118,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={98} src="vid/moho_x_vaho_ventana_calido.mp4" />
    ) },
  { key: "s109", start: 558.233, dur: 5.433, fade: false, z: 119,
    sfx: "sfx/lib/click_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={163} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={163} theme={THEME_EARTH} {...({"title":"Más puntos fríos","shutter":true,"items":[{"image":"img/moho_columna_hormigon_pared.png","label":"La columna"},{"image":"img/moho_techo_viga_esquina.png","label":"El techo"},{"image":"img/moho_marco_ventana_humedad.png","label":"El marco"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s110", start: 563.667, dur: 2.400, fade: false, z: 120,
    sfx: "sfx/lib/tap_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={72} src="img/moho_fill_rincon_frio_dos_paredes_exteriores.png" />
    ) },
  { key: "s111", start: 566.033, dur: 2.200, fade: false, z: 121,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_ropa_tendida_interior.mp4" />
    ) },
  { key: "s112", start: 568.233, dur: 2.200, fade: false, z: 122,
    sfx: "sfx/lib/tap_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={66} src="img/moho_fill_rincon_frio_dos_paredes_exteriores.png" />
    ) },
  { key: "s113", start: 570.433, dur: 2.033, fade: false, z: 123,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={61} src="img/moho_tomas_noche_linterna_rincon.png" />
    ) },
  { key: "s114", start: 572.467, dur: 2.200, fade: false, z: 124,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_vaso_frio_suda.mp4" />
    ) },
  { key: "s115", start: 574.667, dur: 2.200, fade: false, z: 125,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={66} src="img/moho_tomas_noche_linterna_rincon.png" />
    ) },
  { key: "s116", start: 576.467, dur: 6.433, fade: true, z: 126,
    sfx: "sfx/lib/key_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={193} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={193} theme={THEME_EARTH} {...({"image":"img/moho_pelicula_condensacion_fina.png","caption":"Una película finita","sub":"Invisible, unas horas","kenburns":true,"push":0.45,"captionAt":2.9,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s117", start: 582.900, dur: 5.033, fade: false, z: 127,
    sfx: "sfx/lib/whoosh_reverse_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={151} zone="full" theme={THEME_EARTH}>
        <CycleLoop durationInFrames={151} theme={THEME_EARTH} {...({"title":"Cien noches seguidas","center":"Cada día","nodes":[{"label":"Noche: moja"},{"label":"Mañana: seca"},{"label":"Otra vez"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s118", start: 587.933, dur: 2.500, fade: false, z: 128,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={75} src="vid/moho_x_polvo_flota_haz_luz.mp4" />
    ) },
  { key: "s120", start: 592.033, dur: 4.767, fade: false, z: 130,
    sfx: "sfx/lib/impact_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={143} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={143} theme={THEME_EARTH} {...({"eyebrow":"Por eso","title":"Rincón contra medio","left":{"label":"El rincón","sub":"Frío","image":"img/moho_zona_rincon_frio.png","good":false},"right":{"label":"El medio","sub":"Tibio","image":"img/moho_zona_medio_pared_limpia.png","good":true}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s121", start: 596.800, dur: 2.533, fade: false, z: 131,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={76} src="vid/moho_x_ducha_agua_cae.mp4" />
    ) },
  { key: "s122", start: 599.333, dur: 11.533, fade: false, z: 132,
    sfx: "sfx/lib/page_flip_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={346} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={346} theme={THEME_EARTH} {...({"eyebrow":"Detrás del ropero","title":"El mueble le tapa el aire","image":"img/moho_ropero_separado_pared.png","bullets":["Esa pared queda más fría","Y sin ventilación"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s123", start: 610.833, dur: 2.633, fade: false, z: 133,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={79} src="img/moho_tomas_ventana_invierno.png" />
    ) },
  { key: "s124", start: 613.467, dur: 2.167, fade: false, z: 134,
    sfx: "sfx/lib/tick_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={65} src="img/moho_fill_ventana_empanada_invierno.png" />
    ) },
  { key: "s125", start: 615.667, dur: 2.200, fade: false, z: 135,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_vapor_bano_cerrado.mp4" />
    ) },
  { key: "s126", start: 617.867, dur: 1.967, fade: false, z: 136,
    sfx: "sfx/lib/tick_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={59} src="img/moho_fill_ventana_empanada_invierno.png" />
    ) },
  { key: "s127", start: 619.833, dur: 5.967, fade: false, z: 137,
    sfx: "sfx/lib/riser_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={179} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={179} theme={THEME_EARTH} {...({"words":[{"text":"Antes de mezclar"},{"text":"ALGO EN SERIO","boxed":true}],"sub":"No es un formalismo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s128", start: 625.800, dur: 4.700, fade: false, z: 138,
    sfx: "sfx/lib/tap_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={141} src="img/moho_fill_advertencia_dos_botellas_guantes.png" />
    ) },
  { key: "s129", start: 630.467, dur: 7.833, fade: false, z: 139,
    sfx: "sfx/lib/boom_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={235} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={235} theme={THEME_EARTH} {...({"image":"img/moho_dos_botellas.png","label":"NUNCA JUNTOS","sub":"Cloro y vinagre liberan gas cloro"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s130", start: 638.300, dur: 8.333, fade: false, z: 140,
    sfx: "sfx/lib/swish_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={250} zone="full" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={250} theme={THEME_EARTH} {...({"eyebrow":"OJO CON ESTO","bullets":[{"pre":"Quema las ","key":"vías respiratorias"},{"pre":"En un baño ","key":"chico y cerrado"},{"pre":"Manda gente al ","key":"hospital"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s131", start: 646.633, dur: 2.500, fade: false, z: 141,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={75} src="vid/moho_x_gota_baja_marco_ventana.mp4" />
    ) },
  { key: "s133", start: 650.233, dur: 8.900, fade: false, z: 143,
    sfx: "sfx/lib/page_flip_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={267} zone="full" theme={THEME_EARTH}>
        <NumberedSteps durationInFrames={267} theme={THEME_EARTH} {...({"eyebrow":"ANTES","title":"Tres pasos","steps":[{"title":"Agua sola","sub":"Lava la superficie","image":"img/moho_paso_agua_sola.png"},{"title":"Ventilar","sub":"Ventana abierta","image":"img/moho_paso_ventilar.png"},{"title":"Recién ahí","sub":"Empiezas","image":"img/moho_paso_empezar.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s134", start: 658.733, dur: 8.500, fade: true, z: 144,
    sfx: "sfx/lib/ding_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={255} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={255} theme={THEME_EARTH} {...({"title":"No pueden estar","items":["Asmáticos","Bebés","Problemas respiratorios"],"stamp":"VENTILA","kicker":"Mientras trabajas"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s135", start: 666.833, dur: 4.967, fade: true, z: 145,
    sfx: "sfx/lib/squish_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={149} src="img/moho_tomas_guantes.png" />
    ) },
  { key: "s136", start: 671.400, dur: 6.267, fade: true, z: 146,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={188} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={188} theme={THEME_EARTH} {...({"image":"img/moho_nube_esporas.png","caption":"No rasques en seco","sub":"Levanta una nube de esporas","kenburns":true,"push":0.45,"captionAt":2.6,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s137", start: 677.667, dur: 3.233, fade: false, z: 147,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={97} src="img/moho_x_gotas_bajan_vidrio.png" />
    ) },
  { key: "s138", start: 680.900, dur: 6.967, fade: false, z: 148,
    sfx: "sfx/lib/sub_drop_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={209} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={209} theme={THEME_EARTH} {...({"number":"I","title":"Vinagre blanco","sub":"Golpe número uno"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s139", start: 687.867, dur: 5.667, fade: false, z: 149,
    sfx: "sfx/lib/pop_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={170} src="img/moho_tomas_botella_vinagre.png" />
    ) },
  { key: "s140", start: 693.533, dur: 5.633, fade: false, z: 150,
    sfx: "sfx/lib/tap_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={169} src="img/moho_fill_vinagre_rociador_baldosas.png" />
    ) },
  { key: "s141", start: 699.167, dur: 9.767, fade: false, z: 151,
    sfx: "sfx/lib/swish_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={293} zone="full" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={293} theme={THEME_EARTH} {...({"eyebrow":"POR QUÉ FUNCIONA","bullets":[{"pre":"Es una molécula ","key":"chiquita"},{"pre":"Sin ","key":"carga eléctrica"},{"pre":"Por eso ","key":"no rebota"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s142", start: 708.533, dur: 10.967, fade: true, z: 152,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={329} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={329} theme={THEME_EARTH} {...({"kicker":"El recorrido","title":"Se mete adentro","nodes":[{"label":"Poro","sub":"del revoque","image":"img/moho_macro_poro_revoque.png"},{"label":"Fibra","sub":"de la madera","image":"img/moho_macro_fibra_madera.png"},{"label":"Yeso","sub":"de la placa","image":"img/moho_macro_yeso.png"},{"label":"Raíz","sub":"Ahí abajo","image":"img/moho_macro_raiz_filamentos.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s143", start: 719.500, dur: 8.967, fade: false, z: 153,
    sfx: "sfx/lib/impact_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={269} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={269} theme={THEME_EARTH} {...({"eyebrow":"ADENTRO","title":"Hace dos cosas","image":"img/moho_macro_hifas.png","bullets":["Baja el pH: deja de comer","Le rompe la pared celular"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s144", start: 728.467, dur: 2.867, fade: false, z: 154,
    sfx: "sfx/lib/spritz_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={86} src="img/moho_tomas_rocia_pared.png" />
    ) },
  { key: "s145", start: 730.933, dur: 5.267, fade: true, z: 155,
    sfx: "sfx/lib/magic_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={158} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={158} theme={THEME_EARTH} {...({"myth":"El vinagre blanquea","truth":"No blanquea: mata","mythLabel":"MITO","truthLabel":"VERDAD"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s146", start: 736.200, dur: 3.267, fade: false, z: 156,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={98} src="vid/moho_x_visillo_bano_corriente.mp4" />
    ) },
  { key: "s147", start: 739.433, dur: 8.633, fade: false, z: 157,
    sfx: "sfx/lib/swish_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={259} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={259} theme={THEME_EARTH} {...({"eyebrow":"CON VINAGRE","beforeLabel":"Recién rociado","afterLabel":"A la hora","beforeImage":"img/moho_vinagre_recien.png","afterImage":"img/moho_vinagre_una_hora.png","caption":"Se pone más fea: está muriendo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s148", start: 748.067, dur: 7.533, fade: false, z: 158,
    sfx: "sfx/lib/impact_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={226} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={226} theme={THEME_EARTH} {...({"eyebrow":"LA MEZCLA","title":"Puro contra diluido","left":{"label":"PURO","sub":"Como viene","good":true,"image":"img/moho_rociador_puro.png"},"right":{"label":"MITAD Y MITAD","sub":"Pierde fuerza","image":"img/moho_rociador_diluido.png"}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s149", start: 755.600, dur: 5.333, fade: false, z: 159,
    sfx: "sfx/lib/tap_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={160} src="img/moho_fill_rociador_medio_lleno_jarra_agua.png" />
    ) },
  { key: "s150", start: 760.933, dur: 4.133, fade: false, z: 160,
    sfx: "sfx/lib/pour_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={124} src="img/moho_tomas_llena_rociador.png" />
    ) },
  { key: "s151", start: 764.667, dur: 8.867, fade: true, z: 161,
    sfx: "sfx/lib/spritz_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={266} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={266} theme={THEME_EARTH} {...({"eyebrow":"EL MARGEN","title":"Moja más allá del borde","image":"img/moho_mancha_margen.png","callouts":[{"text":"La mancha","sub":"Lo que ves","tx":0.5,"ty":0.46,"side":"right"},{"text":"La raíz","sub":"Siempre más grande","tx":0.2,"ty":0.74,"side":"left"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s152", start: 773.533, dur: 8.533, fade: false, z: 162,
    sfx: "sfx/lib/impact_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={256} zone="full" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={256} theme={THEME_EARTH} {...({"pre":"Si tratas solo ","highlight":"lo negro","post":", dejas viva la mitad","note":"El error más común de todos"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s153", start: 782.067, dur: 2.133, fade: false, z: 163,
    sfx: "sfx/lib/tick_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={64} src="img/moho_fill_borde_mancha_halo_invisible.png" />
    ) },
  { key: "s154", start: 784.200, dur: 2.200, fade: false, z: 164,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_pared_empapada_escurre.mp4" />
    ) },
  { key: "s155", start: 786.400, dur: 1.933, fade: false, z: 165,
    sfx: "sfx/lib/tick_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={58} src="img/moho_fill_borde_mancha_halo_invisible.png" />
    ) },
  { key: "s156", start: 788.333, dur: 6.333, fade: false, z: 166,
    sfx: "sfx/lib/swish_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={190} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={190} theme={THEME_EARTH} {...({"myth":"Limpiar es rociar y frotar","truth":"El vinagre se queda quieto","mythLabel":"MITO","truthLabel":"VERDAD"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s157", start: 794.667, dur: 3.167, fade: false, z: 167,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={95} src="img/moho_x_mancha_se_oscurece_mojada.png" />
    ) },
  { key: "s158", start: 797.833, dur: 10.133, fade: false, z: 168,
    sfx: "sfx/lib/count_tick_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={304} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={304} theme={THEME_EARTH} {...({"eyebrow":"TIEMPO DE CONTACTO","value":1,"prefix":"","suffix":" hora","support":"Mínimo, mojado y quieto","source":"Pared pintada"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s159", start: 807.967, dur: 4.767, fade: false, z: 169,
    sfx: "sfx/lib/click_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_tomas_reloj_taller.png" />
    ) },
  { key: "s160", start: 812.700, dur: 5.800, fade: false, z: 170,
    sfx: "sfx/lib/spritz_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={174} src="img/moho_fill_pared_mojada_secandose_mate.png" />
    ) },
  { key: "s161", start: 818.500, dur: 9.067, fade: false, z: 171,
    sfx: "sfx/lib/squish_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={272} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={272} theme={THEME_EARTH} {...({"eyebrow":"DESPUÉS DE LA HORA","title":"¿Con qué frotas?","left":{"label":"CEPILLO","sub":"Revoque y azulejo","image":"img/moho_cepillo_cerda.png"},"right":{"label":"ESPONJA","sub":"Pintura fina","image":"img/moho_esponja_amarilla.png"}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s162", start: 827.567, dur: 8.033, fade: false, z: 172,
    sfx: "sfx/lib/tap_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={241} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={241} theme={THEME_EARTH} {...({"image":"img/moho_frotar_adentro.png","caption":"De afuera hacia adentro","sub":"No empujes esporas a la pared limpia","kenburns":true,"push":0.45,"captionAt":2.2} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s163", start: 835.633, dur: 8.767, fade: false, z: 173,
    sfx: "sfx/lib/impact_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={263} zone="full" theme={THEME_EARTH}>
        <StampBadge durationInFrames={263} theme={THEME_EARTH} {...({"text":"NO ENJUAGUES","sub":"El olor se va solo en horas","x":0.68,"y":0.3} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s164", start: 844.400, dur: 8.733, fade: false, z: 174,
    sfx: "sfx/lib/shimmer_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={262} zone="full" theme={THEME_EARTH}>
        <CycleLoop durationInFrames={262} theme={THEME_EARTH} {...({"title":"Por qué vuelve","center":"PARED VIRGEN","nodes":[{"label":"Esporas en el aire"},{"label":"Noche húmeda"},{"label":"Aterriza"},{"label":"Vuelve la mancha"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s165", start: 853.133, dur: 2.467, fade: false, z: 175,
    sfx: "sfx/lib/sparkle_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={74} src="img/moho_tomas_polvo_luz.png" />
    ) },
  { key: "s166", start: 855.567, dur: 5.867, fade: false, z: 176,
    sfx: "sfx/lib/tap_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={176} src="img/moho_fill_esporas_polvo_rayo_de_sol.png" />
    ) },
  { key: "s167", start: 861.467, dur: 6.600, fade: false, z: 177,
    sfx: "sfx/lib/riser_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={198} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={198} theme={THEME_EARTH} {...({"words":[{"text":"Necesitas dejar"},{"text":"UN GUARDIA","boxed":true}],"sub":"En la puerta"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s168", start: 868.033, dur: 6.967, fade: false, z: 178,
    sfx: "sfx/lib/sub_drop_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={209} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={209} theme={THEME_EARTH} {...({"number":"II","title":"Bórax","sub":"Golpe número dos"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s169", start: 875.000, dur: 5.233, fade: false, z: 179,
    sfx: "sfx/lib/pop_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={157} src="img/moho_tomas_polvo_mano.png" />
    ) },
  { key: "s170", start: 880.233, dur: 3.367, fade: false, z: 180,
    sfx: "sfx/lib/tap_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={101} src="img/moho_fill_borax_polvo_blanco_ferreteria.png" />
    ) },
  { key: "s171", start: 883.600, dur: 2.200, fade: false, z: 181,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_vierte_agua_caliente_balde.mp4" />
    ) },
  { key: "s172", start: 885.800, dur: 3.133, fade: false, z: 182,
    sfx: "sfx/lib/tap_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={94} src="img/moho_fill_borax_polvo_blanco_ferreteria.png" />
    ) },
  { key: "s173", start: 888.933, dur: 5.567, fade: false, z: 183,
    sfx: "sfx/lib/magic_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={167} zone="top" theme={THEME_EARTH}>
        <KaraokePhrase durationInFrames={167} theme={THEME_EARTH} {...({"phrase":"No se evapora","eyebrow":"LA CLAVE DE TODO","wordDur":14} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s174", start: 894.467, dur: 7.667, fade: false, z: 184,
    sfx: "sfx/lib/tick_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={230} zone="full" theme={THEME_EARTH}>
        <DuelColumns durationInFrames={230} theme={THEME_EARTH} {...({"title":"¿Se queda o se va?","leftName":"Limpiadores","rightName":"Bórax","rows":[{"attr":"Se evapora","leftWins":true},{"attr":"Se queda en el poro","leftWins":false},{"attr":"Sigue meses","leftWins":false}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s175", start: 902.133, dur: 2.167, fade: false, z: 185,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={65} src="img/moho_x_cepillo_cerda_dura.png" />
    ) },
  { key: "s176", start: 904.267, dur: 2.933, fade: false, z: 186,
    sfx: "sfx/lib/pour_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={88} src="img/moho_tomas_borax_balde.png" />
    ) },
  { key: "s177", start: 907.200, dur: 11.167, fade: false, z: 187,
    sfx: "sfx/lib/droplet_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={335} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={335} theme={THEME_EARTH} {...({"kicker":"EL PORO","title":"El agua se va, la sal queda","nodes":[{"label":"Entra","sub":"Con el agua","image":"img/moho_agua_caliente_balde.png"},{"label":"Se seca","sub":"El agua se va","image":"img/moho_poro_entra_agua.png"},{"label":"Queda","sub":"La sal adentro","image":"img/moho_poro_seco_sal.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s178", start: 917.967, dur: 9.200, fade: true, z: 188,
    sfx: "sfx/lib/sparkle_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={276} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={276} theme={THEME_EARTH} {...({"image":"img/moho_poro_cristales.png","caption":"La sal queda cristalizada","sub":"Meses, años, mientras no la mojes","kenburns":true,"push":0.45,"captionAt":3.2,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s179", start: 927.167, dur: 9.800, fade: false, z: 189,
    sfx: "sfx/lib/ui_select_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={294} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={294} theme={THEME_EARTH} {...({"eyebrow":"FUNGISTÁTICO","title":"Deja de ser comida","image":"img/moho_macro_celulosa.png","bullets":["Corta el metabolismo","No digiere la celulosa"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s180", start: 936.967, dur: 3.233, fade: false, z: 190,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={97} src="vid/moho_x_cortina_ligera_se_mueve.mp4" />
    ) },
  { key: "s181", start: 940.200, dur: 7.100, fade: false, z: 191,
    sfx: "sfx/lib/bubble_pop_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={213} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={213} theme={THEME_EARTH} {...({"eyebrow":"LA ESPORA","title":"Llega y no puede","image":"img/moho_espora_filamento.png","callouts":[{"text":"Aterriza","sub":"y germina","tx":0.33,"ty":0.34,"side":"left"},{"text":"Se topa con la sal","sub":"No prospera","tx":0.63,"ty":0.66,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s182", start: 947.300, dur: 4.700, fade: false, z: 192,
    sfx: "sfx/lib/tick_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={141} src="img/moho_fill_cristales_borato_en_el_poro.png" />
    ) },
  { key: "s183", start: 952.000, dur: 8.033, fade: false, z: 193,
    sfx: "sfx/lib/ding_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={241} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={241} theme={THEME_EARTH} {...({"eyebrow":"LA MISMA SAL","title":"Profesional o balde","left":{"label":"TRATAMIENTO PRO","sub":"Vale una fortuna","image":"img/moho_madera_tratada_pro.png"},"right":{"label":"UN BALDE","sub":"La misma sal","good":true,"image":"img/moho_balde_borax.png"}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s184", start: 960.033, dur: 9.567, fade: false, z: 194,
    sfx: "sfx/lib/pour_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={287} zone="full" theme={THEME_EARTH}>
        <NumberedSteps durationInFrames={287} theme={THEME_EARTH} {...({"eyebrow":"MEZCLA","title":"Cómo se prepara","steps":[{"title":"Agua casi hirviendo","sub":"Nunca fría","image":"img/moho_agua_humeante.png"},{"title":"Revuelve","image":"img/moho_revolver_transparente.png"},{"title":"Aplica con brocha","image":"img/moho_brocha_ancha.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s185", start: 969.567, dur: 3.033, fade: false, z: 195,
    sfx: "sfx/lib/splash_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_tomas_revuelve_balde.png" />
    ) },
  { key: "s186", start: 972.600, dur: 3.133, fade: false, z: 196,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={94} src="img/moho_x_bolsa_papel_kraft.png" />
    ) },
  { key: "s187", start: 975.733, dur: 3.767, fade: false, z: 197,
    sfx: "sfx/lib/foam_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={113} src="img/moho_tomas_pincela_borax.png" />
    ) },
  { key: "s188", start: 979.467, dur: 5.933, fade: false, z: 198,
    sfx: "sfx/lib/spritz_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={178} src="img/moho_fill_brocha_ancha_balde_solucion.png" />
    ) },
  { key: "s189", start: 985.400, dur: 8.033, fade: false, z: 199,
    sfx: "sfx/lib/impact_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={241} zone="full" theme={THEME_EARTH}>
        <StampBadge durationInFrames={241} theme={THEME_EARTH} {...({"text":"NO SE ENJUAGA","sub":"Nunca. Sacas el guardia","x":0.66,"y":0.32} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s190", start: 993.433, dur: 9.333, fade: false, z: 200,
    sfx: "sfx/lib/leaves_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={280} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={280} theme={THEME_EARTH} {...({"eyebrow":"AL SECARSE","beforeLabel":"Velo blanquecino","afterLabel":"Cepillo seco","beforeImage":"img/moho_velo_blanquecino.png","afterImage":"img/moho_cepillo_seco.png","caption":"Y listo, ni se nota"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s191", start: 1002.767, dur: 2.367, fade: false, z: 201,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={71} src="img/moho_x_macro_poro_cristales.png" />
    ) },
  { key: "s192", start: 1005.133, dur: 9.533, fade: false, z: 202,
    sfx: "sfx/lib/key_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={286} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={286} theme={THEME_EARTH} {...({"title":"En la descripción","items":["Bórax por litro","Pared pintada","Madera desnuda"],"stamp":"ANOTADO","kicker":"Las proporciones"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s193", start: 1014.633, dur: 2.767, fade: false, z: 203,
    sfx: "sfx/lib/tap_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={83} src="img/moho_fill_balde_agua_caliente_cuchara_polvo.png" />
    ) },
  { key: "s194", start: 1017.400, dur: 2.200, fade: false, z: 204,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_brocha_chorrea.mp4" />
    ) },
  { key: "s195", start: 1019.600, dur: 2.567, fade: false, z: 205,
    sfx: "sfx/lib/tap_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={77} src="img/moho_fill_balde_agua_caliente_cuchara_polvo.png" />
    ) },
  { key: "s196", start: 1022.167, dur: 6.567, fade: false, z: 206,
    sfx: "sfx/lib/riser_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={197} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={197} theme={THEME_EARTH} {...({"words":[{"text":"Cambia todo"},{"text":"SEGÚN LA SUPERFICIE","boxed":true}],"sub":"No es lo mismo una pared que una junta"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s197", start: 1028.733, dur: 7.333, fade: false, z: 207,
    sfx: "sfx/lib/impact_soft_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={220} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={220} theme={THEME_EARTH} {...({"eyebrow":"LA DIFERENCIA","title":"Una vez o tres","left":{"label":"UNA VEZ","sub":"Sabe qué superficie es","good":true,"image":"img/moho_pared_resuelta.png"},"right":{"label":"TRES VECES","sub":"Vuelve a empezar","image":"img/moho_pared_vuelve.png"}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s198", start: 1035.667, dur: 9.100, fade: true, z: 208,
    sfx: "sfx/lib/card_slide_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={273} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={273} theme={THEME_EARTH} {...({"title":"Cada superficie es otra cosa","shutter":true,"items":[{"label":"Pared pintada","image":"img/moho_sup_pared_pintada.png"},{"label":"Junta de azulejo","image":"img/moho_sup_junta_azulejo.png"},{"label":"Madera","image":"img/moho_sup_madera.png"},{"label":"Placa de yeso","image":"img/moho_sup_placa_yeso.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s199", start: 1044.767, dur: 2.200, fade: false, z: 209,
    sfx: "sfx/lib/tap_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={66} src="img/moho_fill_cuatro_superficies_comparadas.png" />
    ) },
  { key: "s200", start: 1046.967, dur: 2.200, fade: false, z: 210,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_gota_baja_pared_pintada.mp4" />
    ) },
  { key: "s201", start: 1049.167, dur: 2.000, fade: false, z: 211,
    sfx: "sfx/lib/tap_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={60} src="img/moho_fill_cuatro_superficies_comparadas.png" />
    ) },
  { key: "s202", start: 1051.200, dur: 21.300, fade: false, z: 212,
    sfx: "sfx/lib/page_flip_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={639} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={639} theme={THEME_EARTH} {...({"image":"img/moho_lamina.png","caption":"Pausa y sácale una foto","sub":"Te ahorra el fin de semana entero","kenburns":true,"push":0.45,"captionAt":6.7,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s203", start: 1072.067, dur: 26.467, fade: true, z: 213,
    sfx: "sfx/lib/whoosh_glass_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={794} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={794} theme={THEME_EARTH} {...({"eyebrow":"ARRIBA","title":"Hasta dónde llega","image":"img/moho_lamina_corte.png","callouts":[{"text":"Se queda arriba","sub":"Cloro","tx":0.2,"ty":0.3,"side":"left"},{"text":"Llega a la raíz","sub":"Vinagre","tx":0.5,"ty":0.74,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s204", start: 1098.167, dur: 13.800, fade: true, z: 214,
    sfx: "sfx/lib/sparkle_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={414} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={414} theme={THEME_EARTH} {...({"image":"img/moho_lamina_borax_zoom.png","label":"LA GUARDIA","sub":"Sal cristalizada en el poro"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s205", start: 1111.567, dur: 5.067, fade: true, z: 215,
    sfx: "sfx/lib/page_flip_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={152} src="img/moho_tomas_senala_tabla.png" />
    ) },
  { key: "s206", start: 1116.233, dur: 19.533, fade: true, z: 216,
    sfx: "sfx/lib/card_slide_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={586} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={586} theme={THEME_EARTH} {...({"eyebrow":"LA TABLA","title":"Siete superficies","image":"img/moho_lamina_tabla.png","bullets":["Pared, revoque y yeso","Madera y juntas","Tela, colchones y techo"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s207", start: 1135.767, dur: 19.900, fade: false, z: 217,
    sfx: "sfx/lib/count_tick_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={597} zone="full" theme={THEME_EARTH}>
        <RankBars durationInFrames={597} theme={THEME_EARTH} {...({"title":"Tiempo de vinagre","unit":"horas","rows":[{"label":"Pared pintada","value":1},{"label":"Revoque poroso","value":2},{"label":"Junta y madera","value":3,"accent":true}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s208", start: 1155.267, dur: 9.767, fade: true, z: 218,
    sfx: "sfx/lib/squish_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={293} zone="full" theme={THEME_EARTH}>
        <MythTruth durationInFrames={293} theme={THEME_EARTH} {...({"myth":"Cepillo duro siempre","truth":"En pintura fina, esponja","mythLabel":"EL REFLEJO","truthLabel":"LA COLUMNA 2"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s209", start: 1165.033, dur: 10.033, fade: false, z: 219,
    sfx: "sfx/lib/swish_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={301} zone="full" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={301} theme={THEME_EARTH} {...({"pre":"Casi todo va ","highlight":"sin enjuagar","post":" y no se toca","note":"Hay una sola excepción"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s210", start: 1175.033, dur: 5.933, fade: false, z: 220,
    sfx: "sfx/lib/tap_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={178} src="img/moho_fill_yeso_sano_vs_yeso_empapado.png" />
    ) },
  { key: "s211", start: 1180.967, dur: 14.733, fade: false, z: 221,
    sfx: "sfx/lib/impact_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={442} zone="full" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={442} theme={THEME_EARTH} {...({"eyebrow":"COLUMNA 4","bullets":[{"pre":"Hay dos filas ","key":"en rojo"},{"pre":"Esas no se ","key":"limpian"},{"pre":"Se cortan y se ","key":"tiran"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s212", start: 1195.333, dur: 9.133, fade: true, z: 222,
    sfx: "sfx/lib/boom_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={274} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={274} theme={THEME_EARTH} {...({"title":"Hiciste todo bien","items":["Vinagre","Bórax","Los tiempos justos"],"stamp":"Y VUELVE IGUAL","kicker":"Si intentas salvarlas"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s213", start: 1204.433, dur: 7.733, fade: false, z: 223,
    sfx: "sfx/lib/sub_drop_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={232} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={232} theme={THEME_EARTH} {...({"words":[{"text":"El método"},{"text":"estaba bien"},{"text":"EL MATERIAL NO","boxed":true}],"sub":"Era irrecuperable"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s214", start: 1212.167, dur: 2.500, fade: false, z: 224,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={75} src="img/moho_x_ladrillo_sin_pintar.png" />
    ) },
  { key: "s215", start: 1214.667, dur: 10.933, fade: false, z: 225,
    sfx: "sfx/lib/chime_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={328} zone="full" theme={THEME_EARTH}>
        <CtaCard durationInFrames={328} theme={THEME_EARTH} {...({"eyebrow":"LA GUÍA DEL CANAL","title":"Humedad y hongos","bullet":"Esta tabla, completa, adentro","price":0,"source":"","cta":"Link en la descripción","image":"img/moho_portada.png"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s216", start: 1225.200, dur: 11.733, fade: true, z: 226,
    sfx: "sfx/lib/glass_ting_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={352} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={352} theme={THEME_EARTH} {...({"image":"img/moho_qr.png","caption":"Apunta la cámara al código","sub":"La guía completa del canal","kenburns":false,"push":0.2,"captionAt":2.4,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s217", start: 1236.933, dur: 2.500, fade: false, z: 227,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={75} src="img/moho_x_agua_corre_junta_azulejo.png" />
    ) },
  { key: "s219", start: 1241.167, dur: 3.267, fade: false, z: 229,
    sfx: "sfx/lib/page_flip_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={98} src="img/moho_tomas_repinta_tercera.png" />
    ) },
  { key: "s220", start: 1244.433, dur: 4.967, fade: false, z: 230,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={149} zone="left" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={149} theme={THEME_EARTH} {...({"pre":"Si vuelve ","highlight":"todos los años","post":"","note":"Está todo en la guía"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s221", start: 1249.367, dur: 18.933, fade: false, z: 231,
    sfx: "sfx/lib/card_slide_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={568} zone="full" theme={THEME_EARTH}>
        <CtaCard durationInFrames={568} theme={THEME_EARTH} {...({"eyebrow":"La guía del canal","title":"Humedad y hongos","bullet":"El mapa de humedad de la casa","price":"","cta":"Link en la descripción","image":"img/moho_guia_impresa_humedad.png"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s222", start: 1268.333, dur: 3.367, fade: false, z: 232,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={101} src="img/moho_x_placa_yeso_blanda.png" />
    ) },
  { key: "s223", start: 1271.700, dur: 5.667, fade: false, z: 233,
    sfx: "sfx/lib/riser_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={170} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={170} theme={THEME_EARTH} {...({"number":"II","title":"Las que no se salvan","sub":"Las dos filas rojas de la tabla"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s224", start: 1277.367, dur: 5.533, fade: false, z: 234,
    sfx: "sfx/lib/card_slide_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={166} zone="full" theme={THEME_EARTH}>
        <LayerStack durationInFrames={166} theme={THEME_EARTH} {...({"title":"La placa por dentro","layers":[{"label":"Cartón: comida"},{"label":"Yeso: esponja"},{"label":"Cartón: comida"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s225", start: 1282.900, dur: 2.733, fade: false, z: 235,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={82} src="img/moho_x_hojas_apiladas_guia.png" />
    ) },
  { key: "s226", start: 1285.667, dur: 3.667, fade: false, z: 236,
    sfx: "sfx/lib/click_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={110} src="img/moho_mancha_superficial_pintura.png" />
    ) },
  { key: "s227", start: 1289.300, dur: 2.267, fade: false, z: 237,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={68} src="img/moho_x_gotas_ducha_azulejo.png" />
    ) },
  { key: "s228", start: 1291.567, dur: 2.467, fade: false, z: 238,
    sfx: "sfx/lib/squish_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={74} src="img/moho_tomas_dedo_placa.png" />
    ) },
  { key: "s229", start: 1294.033, dur: 5.167, fade: false, z: 239,
    sfx: "sfx/lib/ui_select_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={155} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={155} theme={THEME_EARTH} {...({"title":"Se corta si","items":["Cede al dedo","El papel se despega","Está blanda"],"stamp":"SE CORTA"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s230", start: 1299.200, dur: 3.433, fade: false, z: 240,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={103} src="img/moho_x_carton_yeso_capa_rota.png" />
    ) },
  { key: "s231", start: 1302.633, dur: 3.033, fade: false, z: 241,
    sfx: "sfx/lib/whoosh_reverse_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_placa_dorso_negro.png" />
    ) },
  { key: "s232", start: 1305.667, dur: 2.300, fade: false, z: 242,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={69} src="img/moho_x_papel_yeso_burbuja.png" />
    ) },
  { key: "s233", start: 1307.967, dur: 2.900, fade: false, z: 243,
    sfx: "sfx/lib/swish_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={87} src="img/moho_tomas_cutter_placa.png" />
    ) },
  { key: "s234", start: 1310.867, dur: 5.700, fade: false, z: 244,
    sfx: "sfx/lib/impact_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={171} zone="left" theme={THEME_EARTH}>
        <MythTruth durationInFrames={171} theme={THEME_EARTH} {...({"myth":"Cortar por el borde","truth":"Cortar con margen de sobra"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s235", start: 1316.567, dur: 5.933, fade: false, z: 245,
    sfx: "sfx/lib/tick_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={178} src="img/moho_fill_hueco_recortado_placa_yeso.png" />
    ) },
  { key: "s236", start: 1322.500, dur: 10.567, fade: false, z: 246,
    sfx: "sfx/lib/card_slide_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={317} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={317} theme={THEME_EARTH} {...({"title":"Lo que no se salva","shutter":true,"items":[{"image":"img/moho_cortina_ducha_moho.png","label":"La cortina"},{"image":"img/moho_colchon_mancha.png","label":"El colchón"},{"image":"img/moho_almohadon_moho.png","label":"El almohadón"},{"image":"img/moho_sillon_tela_moho.png","label":"El sillón"},{"image":"img/moho_caja_carton_ropero.png","label":"El cartón"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s237", start: 1332.633, dur: 8.233, fade: true, z: 247,
    sfx: "sfx/lib/whoosh_glass_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={247} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={247} theme={THEME_EARTH} {...({"eyebrow":"El colchón por dentro","title":"No está en la cara","image":"img/moho_colchon_corte_espuma.png","callouts":[{"text":"La cara","sub":"Se ve","tx":0.3,"ty":0.26,"side":"left"},{"text":"El volumen","sub":"Ahí vive","tx":0.62,"ty":0.62,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s238", start: 1340.467, dur: 3.267, fade: true, z: 248,
    sfx: "sfx/lib/splash_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={98} src="img/moho_colchon_empapado_chorreando.png" />
    ) },
  { key: "s239", start: 1343.733, dur: 2.600, fade: false, z: 249,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={78} src="img/moho_x_corte_placa_margen.png" />
    ) },
  { key: "s240", start: 1346.333, dur: 8.400, fade: false, z: 250,
    sfx: "sfx/lib/ui_select_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={252} zone="full" theme={THEME_EARTH}>
        <DuelColumns durationInFrames={252} theme={THEME_EARTH} {...({"title":"Blandos: qué hacer","leftName":"SE LAVA","rightName":"SE TIRA","rows":[{"attr":"Cortina de ducha","leftWins":true},{"attr":"Almohadón","leftWins":true},{"attr":"Colchón","leftWins":false},{"attr":"Sillón de tela","leftWins":false},{"attr":"Cartón","leftWins":false}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s241", start: 1354.333, dur: 5.900, fade: true, z: 251,
    sfx: "sfx/lib/pop_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={177} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={177} theme={THEME_EARTH} {...({"image":"img/moho_colchon_vereda_descarte.png","caption":"No se recupera","sub":"El colchón se tira","kenburns":true,"push":0.45,"captionAt":2.4,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s242", start: 1360.233, dur: 3.033, fade: false, z: 252,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_x_cortina_ducha_ondea.png" />
    ) },
  { key: "s243", start: 1363.267, dur: 5.800, fade: false, z: 253,
    sfx: "sfx/lib/riser_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={174} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={174} theme={THEME_EARTH} {...({"number":"III","title":"Cuándo esto no alcanza","sub":"Los tres tipos de humedad"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s244", start: 1369.067, dur: 4.933, fade: false, z: 254,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={148} zone="right" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={148} theme={THEME_EARTH} {...({"pre":"Un video que sirve ","highlight":"para todo","post":" te miente","note":"Te lo digo yo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s245", start: 1374.000, dur: 7.567, fade: false, z: 255,
    sfx: "sfx/lib/droplet_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={227} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={227} theme={THEME_EARTH} {...({"eyebrow":"No viene del aire","title":"Es una filtración","image":"img/moho_cano_roto_dentro_pared.png","bullets":["Caño roto","Gotera del techo","Junta del baño de arriba"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s246", start: 1381.567, dur: 2.967, fade: false, z: 256,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={89} src="vid/moho_x_tambor_lavarropas_gira.mp4" />
    ) },
  { key: "s247", start: 1384.533, dur: 3.233, fade: false, z: 257,
    sfx: "sfx/lib/pour_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={97} src="img/moho_llave_abierta_chorreando.png" />
    ) },
  { key: "s248", start: 1387.767, dur: 6.900, fade: false, z: 258,
    sfx: "sfx/lib/transition_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={207} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={207} theme={THEME_EARTH} {...({"title":"El orden importa","nodes":[{"label":"Arreglar la fuente","sub":"Primero"},{"label":"Tratar el hongo","sub":"Después"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s249", start: 1394.633, dur: 7.267, fade: false, z: 259,
    sfx: "sfx/lib/swish_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={218} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={218} theme={THEME_EARTH} {...({"eyebrow":"Cómo reconocerla","title":"De dónde viene el agua","left":{"label":"Condensación","sub":"Del aire","image":"img/moho_condensacion_esquina_fria.png","good":false},"right":{"label":"Filtración","sub":"Del caño","image":"img/moho_filtracion_forma_mapa.png","good":false}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s250", start: 1401.500, dur: 3.767, fade: true, z: 260,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={113} src="img/moho_techo_mancha_mapa.png" />
    ) },
  { key: "s251", start: 1405.300, dur: 6.567, fade: false, z: 261,
    sfx: "sfx/lib/ui_select_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={197} zone="full" theme={THEME_EARTH}>
        <DuelColumns durationInFrames={197} theme={THEME_EARTH} {...({"title":"Cuál es cuál","leftName":"CONDENSACIÓN","rightName":"FILTRACIÓN","rows":[{"attr":"Mancha difusa","leftWins":true},{"attr":"Borde de mapa","leftWins":false},{"attr":"Peor en frío","leftWins":true},{"attr":"Peor si llueve","leftWins":false}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s252", start: 1411.833, dur: 3.133, fade: false, z: 262,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={94} src="img/moho_x_colchon_manchado_rincon.png" />
    ) },
  { key: "s253", start: 1414.967, dur: 5.800, fade: false, z: 263,
    sfx: "sfx/lib/sub_drop_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={174} src="img/moho_humedad_ascendente_pared.png" />
    ) },
  { key: "s254", start: 1420.367, dur: 9.167, fade: true, z: 264,
    sfx: "sfx/lib/whoosh_glass_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={275} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={275} theme={THEME_EARTH} {...({"eyebrow":"Humedad ascendente","title":"El salitre","image":"img/moho_salitre_borde_horizontal.png","callouts":[{"text":"Borde horizontal","sub":"A la rodilla","tx":0.36,"ty":0.44,"side":"left"},{"text":"Polvillo blanco","sub":"Sal del ladrillo","tx":0.64,"ty":0.72,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s255", start: 1429.133, dur: 3.533, fade: true, z: 265,
    sfx: "sfx/lib/light_pass_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={106} src="img/moho_borde_regla_zocalo.png" />
    ) },
  { key: "s256", start: 1432.633, dur: 5.767, fade: false, z: 266,
    sfx: "sfx/lib/sparkle_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={173} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={173} theme={THEME_EARTH} {...({"image":"img/moho_polvillo_sal_macro.png","label":"Polvillo blanco","sub":"Es sal del ladrillo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s257", start: 1438.433, dur: 5.500, fade: false, z: 267,
    sfx: "sfx/lib/page_flip_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={165} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={165} theme={THEME_EARTH} {...({"eyebrow":"El tercer caso","bullets":[{"pre":"No es ","key":"condensación"},{"pre":"No es ","key":"filtración"},{"pre":"Es ","key":"salitre"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s258", start: 1443.900, dur: 2.567, fade: false, z: 268,
    sfx: "sfx/lib/tick_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={77} src="img/moho_fill_humedad_ascendente_zocalo_salitre.png" />
    ) },
  { key: "s259", start: 1446.500, dur: 2.200, fade: false, z: 269,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_lluvia_pared_exterior.mp4" />
    ) },
  { key: "s260", start: 1448.700, dur: 2.367, fade: false, z: 270,
    sfx: "sfx/lib/tick_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={71} src="img/moho_fill_humedad_ascendente_zocalo_salitre.png" />
    ) },
  { key: "s261", start: 1451.067, dur: 4.400, fade: false, z: 271,
    sfx: "sfx/lib/tap_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={132} src="img/moho_tomas_senala_descripcion.png" />
    ) },
  { key: "s262", start: 1455.467, dur: 5.867, fade: false, z: 272,
    sfx: "sfx/lib/riser_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={176} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={176} theme={THEME_EARTH} {...({"number":"IV","title":"Prevenir","sub":"Cinco cosas que no cuestan nada"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s263", start: 1461.367, dur: 3.033, fade: false, z: 273,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_x_cano_gotea_bajo_pileta.png" />
    ) },
  { key: "s264", start: 1464.400, dur: 5.200, fade: false, z: 274,
    sfx: "sfx/lib/card_slide_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={156} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={156} theme={THEME_EARTH} {...({"title":"Ese olor","shutter":true,"items":[{"image":"img/moho_tierra_mojada_macro.png","label":"Tierra mojada"},{"image":"img/moho_sotano_humedo.png","label":"Sótano"},{"image":"img/moho_ropa_lavarropas_olvidada.png","label":"Ropa olvidada"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s265", start: 1469.600, dur: 5.100, fade: false, z: 275,
    sfx: "sfx/lib/count_tick_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={153} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={153} theme={THEME_EARTH} {...({"eyebrow":"El olor avisa","value":"3","prefix":"","suffix":" semanas","support":"de ventaja","source":"El olor avisa primero"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s266", start: 1474.700, dur: 5.600, fade: false, z: 276,
    sfx: "sfx/lib/tick_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={168} src="img/moho_fill_ropero_abierto_olor_sotano.png" />
    ) },
  { key: "s267", start: 1480.300, dur: 2.800, fade: false, z: 277,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={84} src="img/moho_tomas_huele_ropero.png" />
    ) },
  { key: "s268", start: 1483.100, dur: 6.300, fade: false, z: 278,
    sfx: "sfx/lib/ui_select_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={189} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={189} theme={THEME_EARTH} {...({"title":"Si sientes el olor","items":["No lo ignores","Mira detrás","Corre el mueble"],"stamp":"TRES SEMANAS"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s269", start: 1489.400, dur: 6.467, fade: false, z: 279,
    sfx: "sfx/lib/impact_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={194} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={194} theme={THEME_EARTH} {...({"eyebrow":"Tres semanas de ventaja","title":"La diferencia","left":{"label":"Un trapo","sub":"Si lo hueles hoy","image":"img/moho_trapo_pasada_rincon.png","good":true},"right":{"label":"Repintar","sub":"Si esperas","image":"img/moho_repintar_pared_entera.png","good":false}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s270", start: 1495.467, dur: 3.367, fade: true, z: 280,
    sfx: "sfx/lib/squish_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={101} src="img/moho_tomas_separa_mueble.png" />
    ) },
  { key: "s271", start: 1498.833, dur: 5.933, fade: false, z: 281,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={178} zone="right" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={178} theme={THEME_EARTH} {...({"pre":"Con ","highlight":"cinco centímetros","post":" de aire alcanza","note":"Es gratis y es lo más efectivo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s272", start: 1504.767, dur: 3.233, fade: false, z: 282,
    sfx: "sfx/lib/tick_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={97} src="img/moho_cinta_metrica_cinco_cm.png" />
    ) },
  { key: "s273", start: 1507.967, dur: 2.400, fade: false, z: 283,
    sfx: "sfx/lib/tap_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={72} src="img/moho_fill_mueble_separado_cinco_centimetros.png" />
    ) },
  { key: "s274", start: 1510.367, dur: 2.200, fade: false, z: 284,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_olla_con_tapa_vapor.mp4" />
    ) },
  { key: "s275", start: 1512.567, dur: 2.200, fade: false, z: 285,
    sfx: "sfx/lib/tap_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={66} src="img/moho_fill_mueble_separado_cinco_centimetros.png" />
    ) },
  { key: "s276", start: 1514.767, dur: 4.467, fade: false, z: 286,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={134} src="img/moho_tomas_abre_ventana.png" />
    ) },
  { key: "s277", start: 1519.233, dur: 9.400, fade: false, z: 287,
    sfx: "sfx/lib/swish_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={282} zone="full" theme={THEME_EARTH}>
        <BeforeAfter durationInFrames={282} theme={THEME_EARTH} {...({"eyebrow":"Ventilar bien","beforeLabel":"10 min de par en par","afterLabel":"2 horas entreabierta","beforeImage":"img/moho_ventana_par_en_par.png","afterImage":"img/moho_ventana_entreabierta.png","caption":"La segunda enfría la pared"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s278", start: 1528.633, dur: 3.233, fade: false, z: 288,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={97} src="img/moho_x_ropero_abierto_oscuro.png" />
    ) },
  { key: "s279", start: 1531.867, dur: 7.200, fade: false, z: 289,
    sfx: "sfx/lib/spritz_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={216} zone="full" theme={THEME_EARTH}>
        <SplitPanel durationInFrames={216} theme={THEME_EARTH} {...({"eyebrow":"Cuándo ventilar","title":"Fabricas agua","image":"img/moho_bano_vapor_espejo.png","bullets":["Después de ducharte","Mientras cocinas","Al tender ropa"]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s280", start: 1538.700, dur: 3.667, fade: true, z: 290,
    sfx: "sfx/lib/bubble_pop_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={110} src="img/moho_olla_destapada_vapor.png" />
    ) },
  { key: "s281", start: 1542.367, dur: 7.567, fade: false, z: 291,
    sfx: "sfx/lib/pop_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={227} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={227} theme={THEME_EARTH} {...({"eyebrow":"La olla con tapa","title":"Media hora hirviendo","left":{"label":"Destapada","sub":"Media hora","image":"img/moho_olla_sin_tapa.png","value":"1","unit":"litro","good":false},"right":{"label":"Tapada","sub":"Media hora","image":"img/moho_olla_con_tapa.png","value":"0","unit":"casi nada","good":true}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s282", start: 1549.933, dur: 3.067, fade: false, z: 292,
    sfx: "sfx/lib/whoosh_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={92} src="img/moho_x_mueble_separado_pared.png" />
    ) },
  { key: "s283", start: 1552.967, dur: 7.667, fade: false, z: 293,
    sfx: "sfx/lib/count_tick_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={230} zone="full" theme={THEME_EARTH}>
        <BigStatReveal durationInFrames={230} theme={THEME_EARTH} {...({"eyebrow":"Ropa tendida adentro","value":"3","prefix":"","suffix":" litros","support":"de agua al aire de tu casa","source":"Por cada carga de lavado"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s284", start: 1560.233, dur: 4.433, fade: true, z: 294,
    sfx: "sfx/lib/droplet_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={133} src="img/moho_tendedero_adentro_ventana.png" />
    ) },
  { key: "s285", start: 1564.667, dur: 5.767, fade: false, z: 295,
    sfx: "sfx/lib/tick_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={173} src="img/moho_fill_ropa_tendida_adentro_ventana_cerrada.png" />
    ) },
  { key: "s286", start: 1570.433, dur: 2.767, fade: false, z: 296,
    sfx: "sfx/lib/light_pass_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={83} src="img/moho_tendedero_ventana_abierta.png" />
    ) },
  { key: "s287", start: 1573.200, dur: 5.133, fade: false, z: 297,
    sfx: "sfx/lib/riser_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={154} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={154} theme={THEME_EARTH} {...({"number":"V","title":"El error","sub":"El que hace volver el moho"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s288", start: 1578.333, dur: 6.167, fade: false, z: 298,
    sfx: "sfx/lib/impact_soft_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={185} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={185} theme={THEME_EARTH} {...({"words":[{"text":"El error es"},{"text":"APURARSE"},{"text":"A CERRAR LA PARED","boxed":true}],"sub":"Todo lo demás lo hiciste bien"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s289", start: 1584.467, dur: 2.867, fade: false, z: 299,
    sfx: "sfx/lib/sub_drop_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={86} src="img/moho_pared_fantasma_gris.png" />
    ) },
  { key: "s290", start: 1587.367, dur: 3.067, fade: false, z: 300,
    sfx: "sfx/lib/whoosh_soft_4.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={92} src="vid/moho_x_ventana_abierta_corriente.mp4" />
    ) },
  { key: "s291", start: 1590.433, dur: 4.000, fade: false, z: 301,
    sfx: "sfx/lib/click_soft_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={120} src="img/moho_rodillo_bandeja_lista.png" />
    ) },
  { key: "s292", start: 1594.067, dur: 3.033, fade: true, z: 302,
    sfx: "sfx/lib/swish_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_tomas_rodillo_pared.png" />
    ) },
  { key: "s293", start: 1597.067, dur: 5.600, fade: false, z: 303,
    sfx: "sfx/lib/shimmer_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={168} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={168} theme={THEME_EARTH} {...({"image":"img/moho_lata_pintura_lavable.png","label":"Pintura lavable","sub":"Antihongos, de las buenas"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s294", start: 1602.267, dur: 7.567, fade: true, z: 304,
    sfx: "sfx/lib/key_soft_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={227} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={227} theme={THEME_EARTH} {...({"image":"img/moho_pared_recien_pintada_impecable.png","caption":"Trabajo terminado","sub":"Y acabas de encerrar el agua","kenburns":true,"push":0.45,"captionAt":2.2,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s295", start: 1609.833, dur: 3.000, fade: false, z: 305,
    sfx: "sfx/lib/whoosh_soft_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={90} src="img/moho_x_ventana_entreabierta_invierno.png" />
    ) },
  { key: "s297", start: 1614.233, dur: 5.833, fade: false, z: 307,
    sfx: "sfx/lib/impact_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={175} zone="left" theme={THEME_EARTH}>
        <MythTruth durationInFrames={175} theme={THEME_EARTH} {...({"myth":"Seco al tacto","truth":"Seco por dentro"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s298", start: 1620.033, dur: 7.233, fade: false, z: 308,
    sfx: "sfx/lib/count_tick_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={217} zone="full" theme={THEME_EARTH}>
        <RankBars durationInFrames={217} theme={THEME_EARTH} {...({"title":"Cuánto tarda en secar","unit":"días","rows":[{"label":"La pintura","value":1},{"label":"El revoque","value":30},{"label":"Muro empapado","value":120}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s299", start: 1626.867, dur: 2.900, fade: true, z: 309,
    sfx: "sfx/lib/soil_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={87} src="img/moho_muro_abierto_nucleo_humedo.png" />
    ) },
  { key: "s300", start: 1629.800, dur: 5.900, fade: false, z: 310,
    sfx: "sfx/lib/tick_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={177} src="img/moho_fill_espesor_revoque_humedo_adentro.png" />
    ) },
  { key: "s301", start: 1635.667, dur: 10.600, fade: false, z: 311,
    sfx: "sfx/lib/whoosh_glass_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={318} zone="full" theme={THEME_EARTH}>
        <CutawayCallouts durationInFrames={318} theme={THEME_EARTH} {...({"eyebrow":"Pintura plástica","title":"Película cerrada","image":"img/moho_corte_pintura_pelicula.png","callouts":[{"text":"No pasa el vapor","sub":"Impermeable","tx":0.3,"ty":0.3,"side":"left"},{"text":"El agua de adentro","sub":"No sale","tx":0.62,"ty":0.66,"side":"right"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s302", start: 1646.267, dur: 4.767, fade: false, z: 312,
    sfx: "sfx/lib/tap_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={143} src="img/moho_fill_gotas_perladas_pintura_plastica.png" />
    ) },
  { key: "s303", start: 1651.067, dur: 7.867, fade: false, z: 313,
    sfx: "sfx/lib/page_flip_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={236} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={236} theme={THEME_EARTH} {...({"eyebrow":"Lo que pasa después","bullets":[{"pre":"El agua ","key":"no desaparece"},{"pre":"Si le tapas ","key":"el frente"},{"pre":"Camina ","key":"por adentro"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s304", start: 1658.900, dur: 4.733, fade: false, z: 314,
    sfx: "sfx/lib/tick_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={142} src="img/moho_fill_borde_parche_pintado_humedo.png" />
    ) },
  { key: "s305", start: 1663.633, dur: 5.533, fade: false, z: 315,
    sfx: "sfx/lib/boom_soft_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={166} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={166} theme={THEME_EARTH} {...({"image":"img/moho_anillo_alrededor_parche.png","caption":"El anillo","sub":"La firma de este error","kenburns":true,"push":0.45,"captionAt":2.6,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s306", start: 1669.167, dur: 2.133, fade: false, z: 316,
    sfx: "sfx/lib/tick_5.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={64} src="img/moho_fill_anillo_negro_alrededor_parche.png" />
    ) },
  { key: "s307", start: 1671.267, dur: 2.200, fade: false, z: 317,
    sfx: "sfx/lib/whoosh_soft_6.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_escama_pintura_cae.mp4" />
    ) },
  { key: "s308", start: 1673.467, dur: 1.933, fade: false, z: 318,
    sfx: "sfx/lib/tick_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={58} src="img/moho_fill_anillo_negro_alrededor_parche.png" />
    ) },
  { key: "s309", start: 1675.400, dur: 5.067, fade: false, z: 319,
    sfx: "sfx/lib/foam_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={152} src="img/moho_pintura_ampollada_escamas.png" />
    ) },
  { key: "s310", start: 1680.467, dur: 6.667, fade: false, z: 320,
    sfx: "sfx/lib/impact_soft_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={200} zone="top" theme={THEME_EARTH}>
        <StampBadge durationInFrames={200} theme={THEME_EARTH} {...({"text":"PERDISTE LOS DOS","sub":"La pintura y el trabajo","color":"terracota","x":0.62,"y":0.28} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s311", start: 1687.133, dur: 4.967, fade: false, z: 321,
    sfx: "sfx/lib/tap_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={149} src="img/moho_fill_pared_tratada_esperando_sombra.png" />
    ) },
  { key: "s312", start: 1692.100, dur: 5.733, fade: false, z: 322,
    sfx: "sfx/lib/whoosh_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={172} zone="right" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={172} theme={THEME_EARTH} {...({"pre":"La pregunta no es ","highlight":"cuánto esperar","post":", es cómo saber","note":"Hay una forma de saberlo"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s313", start: 1697.800, dur: 6.233, fade: false, z: 323,
    sfx: "sfx/lib/riser_soft_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={187} zone="full" theme={THEME_EARTH}>
        <ChapterTitle durationInFrames={187} theme={THEME_EARTH} {...({"number":"VI","title":"La prueba del plástico","sub":"Dos minutos y cero dinero"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s314", start: 1703.667, dur: 4.967, fade: true, z: 324,
    sfx: "sfx/lib/tap_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={149} src="img/moho_prueba_plastico_piso_obra.png" />
    ) },
  { key: "s315", start: 1708.600, dur: 6.900, fade: false, z: 325,
    sfx: "sfx/lib/ui_select_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={207} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={207} theme={THEME_EARTH} {...({"title":"Lo que necesitas","items":["Plástico de 40 cm","Cinta adhesiva","Dos minutos"],"stamp":"CERO DINERO"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s316", start: 1715.500, dur: 5.100, fade: false, z: 326,
    sfx: "sfx/lib/tap_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={153} src="img/moho_tomas_pega_plastico_cinta.png" />
    ) },
  { key: "s317", start: 1720.600, dur: 10.500, fade: false, z: 327,
    sfx: "sfx/lib/count_tick_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={315} zone="full" theme={THEME_EARTH}>
        <NumberedSteps durationInFrames={315} theme={THEME_EARTH} {...({"eyebrow":"La prueba","title":"Cuatro pasos","steps":[{"title":"Pégalo a la pared","image":"img/moho_paso_pegar_plastico.png"},{"title":"Sella los 4 lados","image":"img/moho_paso_sellar_cinta.png"},{"title":"Espera 24 o 48 h","image":"img/moho_paso_esperar_plastico.png"},{"title":"Despégalo y mira","image":"img/moho_paso_despegar_mirar.png"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s318", start: 1730.700, dur: 3.033, fade: true, z: 328,
    sfx: "sfx/lib/whoosh_reverse_6.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={91} src="img/moho_tomas_despega_plastico_gotas.png" />
    ) },
  { key: "s319", start: 1733.733, dur: 8.567, fade: false, z: 329,
    sfx: "sfx/lib/ui_select_8.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={257} zone="full" theme={THEME_EARTH}>
        <TierRanking durationInFrames={257} theme={THEME_EARTH} {...({"title":"Leer el plástico","rows":[{"tier":"NO PINTES","color":"terracota","items":["Gotas en la pared"]},{"tier":"VENTILA","color":"ambar","items":["Gotas en el cuarto"]},{"tier":"LISTA","color":"verde","items":["Seco los dos lados"]}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s320", start: 1742.300, dur: 6.067, fade: false, z: 330,
    sfx: "sfx/lib/page_flip_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={182} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={182} theme={THEME_EARTH} {...({"eyebrow":"Si hay gotas adentro","bullets":[{"pre":"Más ","key":"tiempo"},{"pre":"Más ","key":"aire"},{"pre":"Calor ","key":"suave"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s321", start: 1748.367, dur: 5.900, fade: false, z: 331,
    sfx: "sfx/lib/tick_7.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={177} src="img/moho_fill_filtracion_techo_cano_mapa.png" />
    ) },
  { key: "s322", start: 1754.233, dur: 6.733, fade: false, z: 332,
    sfx: "sfx/lib/droplet_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={202} zone="full" theme={THEME_EARTH}>
        <FloatingCutout durationInFrames={202} theme={THEME_EARTH} {...({"image":"img/moho_gotas_cara_exterior_plastico.png","label":"Gotas por fuera","sub":"El agua viene del aire"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s323", start: 1760.967, dur: 5.233, fade: false, z: 333,
    sfx: "sfx/lib/light_pass_5.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={157} zone="right" theme={THEME_EARTH}>
        <HighlightSweep durationInFrames={157} theme={THEME_EARTH} {...({"pre":"Tu pared está ","highlight":"seca por dentro","post":"","note":"El agua viene del aire"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s324", start: 1766.200, dur: 6.300, fade: false, z: 334,
    sfx: "sfx/lib/confirm_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={189} zone="full" theme={THEME_EARTH}>
        <ChecklistReveal durationInFrames={189} theme={THEME_EARTH} {...({"title":"Tu tratamiento","items":["Ventilar 10 minutos","Correr el mueble","Tapar las ollas"],"stamp":"ES POR AHÍ"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s325", start: 1772.533, dur: 3.467, fade: false, z: 335,
    sfx: "sfx/lib/whoosh_soft_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={104} src="img/moho_x_film_plastico_cortado.png" />
    ) },
  { key: "s326", start: 1776.000, dur: 7.433, fade: false, z: 336,
    sfx: "sfx/lib/success_1.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={223} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={223} theme={THEME_EARTH} {...({"image":"img/moho_plastico_seco_dos_lados.png","caption":"Seco de los dos lados","sub":"La pared está lista","kenburns":true,"push":0.45,"captionAt":3.2,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s327", start: 1783.000, dur: 8.400, fade: true, z: 337,
    sfx: "sfx/lib/swish_6.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={252} zone="full" theme={THEME_EARTH}>
        <VsDuel durationInFrames={252} theme={THEME_EARTH} {...({"eyebrow":"Con qué cerrar la pared","title":"Cuál pintura","left":{"label":"Mineral","sub":"Cal o silicato","image":"img/moho_pintura_cal_balde.png","good":true},"right":{"label":"Plástica","sub":"Película cerrada","image":"img/moho_pintura_plastica_balde.png","good":false}} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s328", start: 1791.000, dur: 3.700, fade: true, z: 338,
    sfx: "sfx/lib/leaves_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={111} src="img/moho_pincel_cal_pared.png" />
    ) },
  { key: "s329", start: 1794.700, dur: 2.067, fade: false, z: 339,
    sfx: "sfx/lib/tick_8.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={62} src="img/moho_fill_pintura_mineral_cal_respira.png" />
    ) },
  { key: "s330", start: 1796.767, dur: 2.200, fade: false, z: 340,
    sfx: "sfx/lib/whoosh_soft_1.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_gotas_cara_exterior_plastico.mp4" />
    ) },
  { key: "s331", start: 1798.967, dur: 1.867, fade: false, z: 341,
    sfx: "sfx/lib/tick_1.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={56} src="img/moho_fill_pintura_mineral_cal_respira.png" />
    ) },
  { key: "s332", start: 1800.833, dur: 5.533, fade: false, z: 342,
    sfx: "sfx/lib/impact_soft_3.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={166} zone="left" theme={THEME_EARTH}>
        <MythTruth durationInFrames={166} theme={THEME_EARTH} {...({"myth":"Sellarla ya","truth":"Dejarla respirar"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s333", start: 1806.367, dur: 8.933, fade: false, z: 343,
    sfx: "sfx/lib/transition_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={268} zone="full" theme={THEME_EARTH}>
        <FlowSteps durationInFrames={268} theme={THEME_EARTH} {...({"title":"El plan completo","nodes":[{"label":"Vinagre"},{"label":"Bórax"},{"label":"Secar de verdad"},{"label":"Probar el plástico"},{"label":"Cerrar con mineral"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s334", start: 1815.267, dur: 8.133, fade: false, z: 344,
    sfx: "sfx/lib/boom_soft_7.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={244} zone="top" theme={THEME_EARTH}>
        <HookCaption durationInFrames={244} theme={THEME_EARTH} {...({"words":[{"text":"El hongo es"},{"text":"EL SÍNTOMA","boxed":true},{"text":"El agua es la enfermedad"}],"sub":"Saca el agua del aire"} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s335", start: 1823.400, dur: 4.867, fade: false, z: 345,
    sfx: "sfx/lib/tap_4.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={146} src="img/moho_fill_techo_bano_esquina_manchada.png" />
    ) },
  { key: "s336", start: 1828.267, dur: 7.933, fade: false, z: 346,
    sfx: "sfx/lib/card_slide_2.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={238} zone="full" theme={THEME_EARTH}>
        <PhotoCarousel durationInFrames={238} theme={THEME_EARTH} {...({"title":"¿En qué rincón te sale?","shutter":true,"items":[{"image":"img/moho_rincon_esquina_cuarto.png","label":"La esquina"},{"image":"img/moho_rincon_techo_bano.png","label":"El techo del baño"},{"image":"img/moho_rincon_detras_ropero.png","label":"Detrás del ropero"},{"image":"img/moho_rincon_marco_ventana.png","label":"La ventana"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s337", start: 1836.200, dur: 4.567, fade: false, z: 347,
    sfx: "sfx/lib/tick_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={137} src="img/moho_fill_marco_ventana_madera_junta_negra.png" />
    ) },
  { key: "s338", start: 1840.767, dur: 5.733, fade: false, z: 348,
    sfx: "sfx/lib/shimmer_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={172} zone="full" theme={THEME_EARTH}>
        <FramedPhoto durationInFrames={172} theme={THEME_EARTH} {...({"image":"img/moho_teaser_pared_fria_aislada.png","caption":"El próximo video","sub":"La pared fría, por dentro","kenburns":true,"push":0.45,"captionAt":2.4,"typewriter":true} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s339", start: 1846.500, dur: 7.367, fade: false, z: 349,
    sfx: "sfx/lib/page_flip_4.mp3",
    el: (d: number) => (
      <PremiumOverlay durationInFrames={221} zone="left" theme={THEME_EARTH}>
        <BulletCascade durationInFrames={221} theme={THEME_EARTH} {...({"eyebrow":"El próximo video","bullets":[{"pre":"Sin ","key":"romper nada"},{"pre":"Sin ","key":"obra"},{"pre":"Para que el vapor ","key":"no condense"}]} as any)} />
      </PremiumOverlay>
    ) },
  { key: "s340", start: 1853.867, dur: 2.967, fade: false, z: 350,
    sfx: "sfx/lib/bell_soft_2.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={89} src="img/moho_fill_panel_aislante_pared_fria_taller.png" />
    ) },
  { key: "s341", start: 1856.833, dur: 2.200, fade: false, z: 351,
    sfx: "sfx/lib/whoosh_soft_2.mp3",
    el: (d: number) => (
      <ClipShot durationInFrames={66} src="vid/moho_x_vapor_se_disipa_cuarto.mp4" />
    ) },
  { key: "s342", start: 1859.033, dur: 2.767, fade: false, z: 352,
    sfx: "sfx/lib/bell_soft_3.mp3",
    el: (d: number) => (
      <CineShot durationInFrames={83} src="img/moho_fill_panel_aislante_pared_fria_taller.png" />
    ) },
];
