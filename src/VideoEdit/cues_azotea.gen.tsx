// cues_azotea.gen.tsx — GENERADO por beatsheet.mjs desde azotea.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/azotea.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ScrollDoc } from "./scenes/ScrollDoc";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { BarCompare } from "./scenes/BarCompare";
import { CalloutMark } from "./scenes/CalloutMark";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 2.51, dur: 2.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_techo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_2", start: 5.13, dur: 8.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_losa_gris.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_3", start: 13.93, dur: 6.12, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_esponja.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_4", start: 20.05, dur: 4.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_agua_chupa.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_5", start: 24.75, dur: 5.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_hierro_oxida.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_6", start: 30.54, dur: 3.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_oxido_raja.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_7", start: 34.3, dur: 4.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_mancha_amarilla.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_8", start: 38.45, dur: 11.43, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_gota_noche.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_9", start: 49.88, dur: 8.51, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_ferreteria.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_10", start: 58.39, dur: 0.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_dineral.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_11", start: 58.85, dur: 0.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_balde_caro.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_12", start: 59.31, dur: 14.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_pintando_rojo.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_13", start: 73.92, dur: 1.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_globo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_14", start: 75.36, dur: 13.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_goma_despella.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_15", start: 89.28, dur: 12.92, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Un"},{"t":"escudo"},{"t":"de"},{"t":"cristal","hl":true}]} eyebrow="Menos de dos dólares" hue="blue" bg="image" image="vid/az_hook_super.mp4" /> },
  { key: "hook_16", start: 102.2, dur: 2.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_tomas_hook.png" hue="amber" kicker="El líquido de $2" /> },
  { key: "guia1_0", start: 104.76, dur: 24.52, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="+40" image="vid/az_manual1.mp4" caption="arreglos de la casa, en un solo lugar" accent="good" hue="amber" /> },
  { key: "falla_0", start: 129.28, dur: 16.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_goma_capa.mp4" hue="red" clipDur={2.5} /> },
  { key: "falla_1", start: 146.21, dur: 8.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_no_agarra.mp4" hue="blue" clipDur={2.5} /> },
  { key: "falla_2", start: 154.6, dur: 12.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_sella_adentro.mp4" hue="amber" clipDur={2.5} /> },
  { key: "falla_3", start: 166.69, dur: 8.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_ampollas.mp4" hue="red" clipDur={2.5} /> },
  { key: "falla_4", start: 175.3, dur: 8.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_sol_cuartea.mp4" hue="blue" clipDur={2.5} /> },
  { key: "falla_5", start: 183.91, dur: 25.9, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/az_industria.mp4" words={parseQuote("Está *diseñado para durar poco*.")} accent="danger" hue="amber" /> },
  { key: "cancer_0", start: 209.81, dur: 27.12, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/cancer_0.mp4" items={[{"png":"img/az_cut_varilla.png","title":"El óxido se expande 7×","body":"y revienta la losa desde adentro"}]} side="right" eyebrow="El cáncer del concreto" /> },
  { key: "cancer_1", start: 236.93, dur: 15.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_cascotes.mp4" hue="amber" clipDur={2.5} /> },
  { key: "prep_0", start: 252.79, dur: 17.87, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_superficie.mp4" hue="amber" clipDur={2.5} /> },
  { key: "prep_1", start: 270.66, dur: 1.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_no_es_cemento.mp4" hue="red" clipDur={2.5} /> },
  { key: "prep_2", start: 272.18, dur: 10.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_costra.mp4" hue="blue" clipDur={2.5} /> },
  { key: "prep_3", start: 283.08, dur: 13.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_deslava.mp4" hue="amber" clipDur={2.5} /> },
  { key: "prep_4", start: 296.75, dur: 9.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_espatula.mp4" hue="red" clipDur={2.5} /> },
  { key: "prep_5", start: 306.46, dur: 8.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_escoba.mp4" hue="blue" clipDur={2.5} /> },
  { key: "prep_6", start: 314.73, dur: 4.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_hidro.mp4" hue="amber" clipDur={2.5} /> },
  { key: "prep_7", start: 318.88, dur: 16.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_barro_negro.mp4" hue="red" clipDur={2.5} /> },
  { key: "prep_8", start: 335.38, dur: 5.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_secar_sol.mp4" hue="blue" clipDur={2.5} /> },
  { key: "prep_9", start: 340.77, dur: 22.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_poros_abren.png" hue="amber" /> },
  { key: "prep_10", start: 363.32, dur: 6.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_tercer_dia.mp4" hue="red" clipDur={2.5} /> },
  { key: "receta_0", start: 370.28, dur: 15.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_sombra.mp4" hue="red" clipDur={2.5} /> },
  { key: "receta_1", start: 386.08, dur: 12.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/az_balde20.mp4" hue="blue" clipDur={2.5} /> },
  { key: "receta_2", start: 398.16, dur: 8.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_agua.png" hue="amber" /> },
  { key: "receta_3", start: 406.18, dur: 5.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_cemento_blanco.png" hue="red" /> },
  { key: "receta_4", start: 411.63, dur: 9.9, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_no_gris.png" hue="blue" /> },
  { key: "receta_5", start: 421.53, dur: 15.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_echar_tazas.png" hue="amber" /> },
  { key: "receta_6", start: 436.69, dur: 8.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_revolver.png" hue="red" /> },
  { key: "receta_7", start: 445.62, dur: 4.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_rajaduras.png" hue="blue" /> },
  { key: "receta_8", start: 449.75, dur: 9.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_piedra_dura.png" hue="amber" /> },
  { key: "receta_9", start: 459.46, dur: 19.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_resina.png" hue="red" /> },
  { key: "receta_10", start: 479.38, dur: 21.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_resina_chicloso.png" hue="blue" /> },
  { key: "receta_11", start: 501, dur: 5.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_detergente.png" hue="amber" /> },
  { key: "receta_12", start: 506.28, dur: 4.21, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_tension.png" hue="red" /> },
  { key: "receta_13", start: 510.49, dur: 8.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_penetra.png" hue="blue" /> },
  { key: "receta_14", start: 519.27, dur: 17.15, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_brillo_satinado.png" hue="amber" /> },
  { key: "guia2_0", start: 536.42, dur: 11.86, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="×m²" image="img/az_manual2.png" caption="cantidades exactas, para no desperdiciar" accent="good" hue="blue" /> },
  { key: "aplica_0", start: 548.28, dur: 13.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_temprano.png" hue="amber" /> },
  { key: "aplica_1", start: 562.16, dur: 4.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_losa_fria.png" hue="red" /> },
  { key: "aplica_2", start: 566.19, dur: 19.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_evapora.png" hue="blue" /> },
  { key: "aplica_3", start: 585.38, dur: 5.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_charco.png" hue="amber" /> },
  { key: "aplica_4", start: 590.97, dur: 9.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_jalador.png" hue="red" /> },
  { key: "aplica_5", start: 600.02, dur: 17.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_empuja.png" hue="blue" /> },
  { key: "aplica_6", start: 617.78, dur: 13.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_rodillo.png" hue="amber" /> },
  { key: "aplica_7", start: 631.49, dur: 4.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_gris_blanco.png" hue="red" /> },
  { key: "aplica_8", start: 636.48, dur: 21.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_cuatro_horas.png" hue="blue" /> },
  { key: "aplica_9", start: 658.33, dur: 7.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_segunda_cruzada.png" hue="amber" /> },
  { key: "aplica_10", start: 665.62, dur: 9.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_coraza.png" hue="red" /> },
  { key: "prueba_0", start: 675.41, dur: 14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_tormenta.png" hue="red" /> },
  { key: "prueba_1", start: 689.41, dur: 2.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_trapos_baldes.png" hue="blue" /> },
  { key: "prueba_2", start: 692, dur: 12.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_sillon.png" hue="amber" /> },
  { key: "prueba_3", start: 704.58, dur: 8.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_gotitas_teflon.png" hue="red" /> },
  { key: "prueba_4", start: 712.6, dur: 8.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_rebota_rejilla.png" hue="blue" /> },
  { key: "prueba_5", start: 721.32, dur: 14.88, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/az_losa_sellada.png" words={parseQuote("Fácil, barata, y *para siempre*.")} hue="amber" /> },
  { key: "usos_0", start: 736.2, dur: 20.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_pared_ladrillo.png" hue="blue" /> },
  { key: "usos_1", start: 756.92, dur: 6.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_cisterna.png" hue="amber" /> },
  { key: "usos_2", start: 763.32, dur: 2.17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_base_columna.png" hue="red" /> },
  { key: "usos_3", start: 765.49, dur: 17.95, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_jardinera.png" hue="blue" /> },
  { key: "usos_4", start: 783.44, dur: 36.29, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Balde de marca","value":40,"tone":"danger"},{"label":"Casero","value":2,"winner":true}]} title="Lo que ahorrás" unit="US$" hue="amber" /> },
  { key: "faq_0", start: 819.73, dur: 5.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_tomas_faq.png" hue="amber" kicker="Las dudas de siempre" /> },
  { key: "faq_1", start: 825.28, dur: 84.04, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Duración","heading":"¿Cuánto dura?","body":"Primera, ¿cuánto dura? Bien hecho.","poster":"img/az_q_dura.png"},{"eyebrow":"Superficie","heading":"¿Chapa o teja?","body":"o de teja? Este escudo es para superficies porosas. Losa","poster":"img/az_q_teja.png"},{"eyebrow":"Rendimiento","heading":"¿Cuántos m²?","body":"menos de diez a quince metros cuadrados según lo sedienta que esté","poster":"img/az_q_metros.png"},{"eyebrow":"Color","heading":"¿Puedo pintarlo?","body":"poco de pigmento a la última mano. Blanco es lo mejor igual,","poster":"img/az_q_pintar.png"}]} /> },
  { key: "errores_0", start: 909.32, dur: 49.39, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Error 1","heading":"Sobre mugre","body":"Los errores que arruinan todo, para que no los cometas. Son","poster":"img/az_e_mugre.png"},{"eyebrow":"Error 2","heading":"Losa caliente","body":"es el 80% del trabajo. Dos, aplicar","poster":"img/az_e_sol.png"},{"eyebrow":"Error 3","heading":"Cemento gris","body":"de blanco o meterle yeso. El gris es grueso,","poster":"img/az_e_gris.png"},{"eyebrow":"Error 4","heading":"Mezcla parada","body":"Esto frague en el balde. Prepara solo lo que vas a usar","poster":"img/az_e_fragua.png"}]} /> },
  { key: "industria_0", start: 958.71, dur: 22.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_gondola.png" hue="blue" /> },
  { key: "industria_1", start: 981, dur: 68.62, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Necesitan"},{"t":"que"},{"t":"falle","hl":true}]} eyebrow="Para que vuelvas a comprar" hue="amber" bg="image" image="img/az_cinta.png" /> },
  { key: "cta_0", start: 1049.62, dur: 35.95, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/az_manual3.png" words={parseQuote("Con ahorrarte UN balde, *ya lo pagaste*.")} accent="good" hue="amber" /> },
  { key: "cierre_0", start: 1085.57, dur: 20.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_salitre.png" hue="red" /> },
  { key: "cierre_1", start: 1105.84, dur: 23.58, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/az_tomas_cierre.png" hue="blue" kicker="La humedad que sube por los muros" /> },
  { key: "cierre_2", start: 1129.42, dur: 5.84, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Que"},{"t":"el"},{"t":"agua"},{"t":"rebote","hl":true}]} eyebrow="Dormí tranquilo aunque truene" hue="amber" bg="image" image="img/az_cierre_gota.png" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":89.28,"role":"popUp","vol":0.32},{"at":104.76,"role":"popUp","vol":0.32},{"at":183.91,"role":"popUp","vol":0.32},{"at":209.81,"role":"popUp","vol":0.32},{"at":536.42,"role":"popUp","vol":0.32},{"at":721.32,"role":"popUp","vol":0.32},{"at":783.44,"role":"popUp","vol":0.32},{"at":825.28,"role":"popUp","vol":0.32},{"at":909.32,"role":"popUp","vol":0.32},{"at":981,"role":"popUp","vol":0.32},{"at":1049.62,"role":"popUp","vol":0.32},{"at":1129.42,"role":"popUp","vol":0.32}];
