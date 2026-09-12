// cues_quebracho.gen.tsx — GENERADO por beatsheet.mjs desde quebracho.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/quebracho.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ScrollDoc } from "./scenes/ScrollDoc";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { Checklist } from "./scenes/Checklist";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 2.86, dur: 3.63, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_hacha_rebota.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_2", start: 6.49, dur: 2.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_poste_100.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_3", start: 8.62, dur: 2.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_durmiente.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_4", start: 10.75, dur: 2.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_estufa_raja.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_5", start: 12.89, dur: 2.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_generaciones.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_6", start: 15.02, dur: 2.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_hunde_agua.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_7", start: 17.15, dur: 29.59, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"100"},{"t":"años"},{"t":"enterrada."},{"t":"Sin"},{"t":"pudrirse","hl":true}]} eyebrow="La madera que rompe el hacha" hue="blue" bg="image" image="vid/qb_hook_super.mp4" /> },
  { key: "hook_8", start: 46.74, dur: 44.38, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_hook.png" hue="red" kicker="La madera que quisieron borrar" /> },
  { key: "conoces_0", start: 91.12, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_ensena.png" hue="blue" /> },
  { key: "conoces_1", start: 98.25, dur: 7.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_arbol.mp4" hue="red" clipDur={2.5} /> },
  { key: "conoces_2", start: 105.39, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_nandubay_alambrado.mp4" hue="amber" clipDur={2.5} /> },
  { key: "conoces_3", start: 112.52, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_ruta_postes.mp4" hue="blue" clipDur={2.5} /> },
  { key: "conoces_4", start: 119.65, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_urunday_rojo.mp4" hue="red" clipDur={2.5} /> },
  { key: "conoces_5", start: 126.78, dur: 7.14, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_hacha_rebota_cerca.mp4" hue="amber" clipDur={2.5} /> },
  { key: "conoces_6", start: 133.92, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_osage_arco.mp4" hue="blue" clipDur={2.5} /> },
  { key: "conoces_7", start: 141.05, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_caballo.mp4" hue="red" clipDur={2.5} /> },
  { key: "conoces_8", start: 148.18, dur: 14.27, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/conoces_8.mp4" items={[{"png":"img/qb_cut_colorado.png","title":"Quebracho","body":"el rey"},{"png":"img/qb_cut_nandubay.png","title":"Ñandubay"},{"png":"img/qb_cut_urunday.png","title":"Urunday"},{"png":"img/qb_cut_algarrobo.png","title":"Algarrobo"},{"png":"img/qb_cut_lapacho.png","title":"Lapacho"}]} side="right" eyebrow="Las maderas eternas" /> },
  { key: "conoces_9", start: 162.45, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_itin_arbol.mp4" hue="blue" clipDur={2.5} /> },
  { key: "conoces_10", start: 169.58, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_lapacho.mp4" hue="red" clipDur={2.5} /> },
  { key: "conoces_11", start: 176.71, dur: 7.13, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_algarrobo_arbol.mp4" hue="amber" clipDur={2.5} /> },
  { key: "conoces_12", start: 183.84, dur: 4.76, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Por"},{"t":"qué"},{"t":"esta"},{"t":"no"},{"t":"se"},{"t":"pudre","hl":true}]} eyebrow="La misma madera imposible, en todo el mundo" hue="blue" bg="image" image="vid/qb_mundo.mp4" /> },
  { key: "ciencia_0", start: 188.6, dur: 7.64, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/ciencia_0.mp4" pages={[{"image":"img/dg_qb_densidad.png","eyebrow":"Densidad: anillos finos, sin aire para el hongo"},{"image":"img/dg_qb_taninos.png","eyebrow":"Taninos: veneno natural contra hongo y termita"}]} /> },
  { key: "ciencia_1", start: 196.24, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_anillos_finos.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ciencia_2", start: 210.9, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_pesa_hierro.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ciencia_3", start: 225.56, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_resinas.mp4" hue="red" clipDur={2.5} /> },
  { key: "ciencia_4", start: 240.22, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_tanino_hongo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ciencia_5", start: 254.88, dur: 5.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_termita_va.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ciencia_6", start: 260.27, dur: 5.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_bacteria_no.mp4" hue="red" clipDur={2.5} /> },
  { key: "ciencia_7", start: 265.66, dur: 10.79, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/ciencia_7.mp4" items={[{"png":"img/qb_cut_veta.png","title":"Anillos finos","body":"sin aire, no entra la pudrición"},{"png":"img/qb_cut_hongo.png","title":"El hongo se muere"},{"png":"img/qb_cut_termita.png","title":"La termita se va"}]} side="left" eyebrow="Veneno de fábrica" /> },
  { key: "ciencia_8", start: 276.45, dur: 13.53, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/qb_blindada.mp4" words={parseQuote("Ya viene con la protección puesta *de fábrica*.")} hue="blue" /> },
  { key: "dureza_0", start: 289.98, dur: 7, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Pino (corralón)","value":15},{"label":"Roble","value":50},{"label":"Quebracho colorado","value":100,"winner":true}]} title="Dureza (escala Janka)" hue="amber" /> },
  { key: "dureza_1", start: 296.98, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_sierra_chispas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "dureza_2", start: 305.38, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_filo_embota.mp4" hue="red" clipDur={2.5} /> },
  { key: "dureza_3", start: 313.78, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_carpintero_maldice.mp4" hue="amber" clipDur={2.5} /> },
  { key: "dureza_4", start: 322.18, dur: 8.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_brasas_horas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "dureza_5", start: 330.58, dur: 30.94, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/dureza_5.mp4" items={[{"png":"img/qb_cut_hacha.png","title":"Rompe el hacha","body":"más dura que el roble"}]} side="left" eyebrow="Dureza Janka" /> },
  { key: "dureza_6", start: 361.52, dur: 29.17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_arde_brasas.mp4" hue="amber" clipDur={2.5} /> },
  { key: "especies_0", start: 390.69, dur: 17.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_especies.png" hue="blue" kicker="Cada una tiene su carácter" /> },
  { key: "especies_1", start: 407.72, dur: 68.12, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"El rey","heading":"Quebracho colorado","body":"mundo entero. Competi contra cualquiera.","media":"vid/qb_e_colorado.mp4"},{"eyebrow":"Durísimo igual","heading":"Quebracho blanco","body":"postes colorados de hace más de 100 años todavía","media":"vid/qb_e_blanco.mp4"},{"eyebrow":"El del alambrado","heading":"Ñandubay","body":"El nandubay, el clásico del alambrado","media":"vid/qb_e_nandubay.mp4"},{"eyebrow":"Rojo sangre","heading":"Urunday","body":"rojizo, que se usaba para las obras que tenían que","media":"vid/qb_e_urunday.mp4"},{"eyebrow":"Casi imposible","heading":"Itín","body":"es noble y hermoso para los muebles.","media":"vid/qb_e_itin.mp4"},{"eyebrow":"Noble y hermoso","heading":"Algarrobo","body":"Crecieron peleando. En suelos secos,","media":"vid/qb_e_algarrobo.mp4"}]} /> },
  { key: "especies_2", start: 475.84, dur: 8.4, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/qb_pelearon.mp4" words={parseQuote("La comodidad hace madera blanda. La pelea hace madera *eterna*.")} hue="amber" /> },
  { key: "belleza_0", start: 484.24, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_mesa_algarrobo.mp4" hue="red" clipDur={2.5} /> },
  { key: "belleza_1", start: 496.84, dur: 12.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_veta_roja.mp4" hue="amber" clipDur={2.5} /> },
  { key: "belleza_2", start: 509.43, dur: 12.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_marca_anos.mp4" hue="blue" clipDur={2.5} /> },
  { key: "belleza_3", start: 522.03, dur: 12.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_lustre.mp4" hue="red" clipDur={2.5} /> },
  { key: "historia_0", start: 534.62, dur: 33.55, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/historia_0.mp4" pages={[{"image":"img/dg_qb_tanino.png","eyebrow":"El veneno del árbol curtía el cuero del mundo"}]} /> },
  { key: "historia_1", start: 568.17, dur: 19.59, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/historia_1.mp4" items={[{"png":"img/qb_cut_mapa.png","title":"El Chaco","body":"millones de quebrachos"}]} side="right" eyebrow="La Forestal" /> },
  { key: "historia_2", start: 587.76, dur: 9.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_forestal_fabrica.mp4" hue="red" clipDur={2.5} /> },
  { key: "historia_3", start: 597.56, dur: 9.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_hacheros.mp4" hue="amber" clipDur={2.5} /> },
  { key: "historia_4", start: 607.35, dur: 9.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_hervir_madera.mp4" hue="blue" clipDur={2.5} /> },
  { key: "historia_5", start: 617.15, dur: 9.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_tren_monte.mp4" hue="red" clipDur={2.5} /> },
  { key: "historia_6", start: 626.94, dur: 9.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_extracto_tanino.mp4" hue="amber" clipDur={2.5} /> },
  { key: "historia_7", start: 636.74, dur: 9.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_cuero_curtido.mp4" hue="blue" clipDur={2.5} /> },
  { key: "historia_8", start: 646.54, dur: 9.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_rollizos.mp4" hue="red" clipDur={2.5} /> },
  { key: "historia_9", start: 656.33, dur: 9.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_almacen_empresa.mp4" hue="amber" clipDur={2.5} /> },
  { key: "historia_10", start: 666.13, dur: 9.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_casas_caidas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "historia_11", start: 675.92, dur: 7.84, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Se llevaron en décadas lo que la naturaleza tardó siglos en hacer" lines={[{"text":"Millones de quebrachos volteados por su tanino.","mark":true},{"text":"Cuando el monte se agotó, la empresa se fue."}]} image="vid/qb_pueblo_fantasma.mp4" hue="red" /> },
  { key: "borrar_0", start: 683.76, dur: 24.06, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_cerca_viva.mp4" hue="blue" clipDur={2.5} /> },
  { key: "borrar_1", start: 707.82, dur: 24.05, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_poste_campo.mp4" hue="red" clipDur={2.5} /> },
  { key: "borrar_2", start: 731.87, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_alambre_puas.mp4" hue="amber" clipDur={2.5} /> },
  { key: "borrar_3", start: 740.9, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_cerca_muralla.mp4" hue="blue" clipDur={2.5} /> },
  { key: "borrar_4", start: 749.93, dur: 9.02, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_grampas.mp4" hue="red" clipDur={2.5} /> },
  { key: "borrar_5", start: 758.95, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_fabrica_alambre.mp4" hue="amber" clipDur={2.5} /> },
  { key: "borrar_6", start: 767.98, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_herbicida_cerca.mp4" hue="blue" clipDur={2.5} /> },
  { key: "borrar_7", start: 777.01, dur: 9.03, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_poste_tratado.mp4" hue="red" clipDur={2.5} /> },
  { key: "borrar_8", start: 786.04, dur: 70.5, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Si"},{"t":"dura"},{"t":"demasiado"},{"t":"dejan"},{"t":"de"},{"t":"nombrarlo","hl":true}]} eyebrow="No lo prohíben: lo hacen quedar mal" hue="amber" bg="image" image="vid/qb_plaga.mp4" /> },
  { key: "reconocer_0", start: 856.54, dur: 25.43, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Cómo reconocer la madera buena" items={[{"text":"Pesa una barbaridad para su tamaño","state":"done"},{"text":"Tirada al agua, se HUNDE","state":"done"},{"text":"Cortada fresca, huele fuerte a tanino","state":"done"}]} hue="red" /> },
  { key: "reconocer_1", start: 881.97, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_test_agua.mp4" hue="amber" clipDur={2.5} /> },
  { key: "reconocer_2", start: 899.24, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_peso_mano.mp4" hue="blue" clipDur={2.5} /> },
  { key: "reconocer_3", start: 916.51, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_olor_tanino.mp4" hue="red" clipDur={2.5} /> },
  { key: "reconocer_4", start: 933.78, dur: 17.28, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_veta_densa.mp4" hue="amber" clipDur={2.5} /> },
  { key: "reconocer_5", start: 951.06, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_clavo_dobla.mp4" hue="blue" clipDur={2.5} /> },
  { key: "reconocer_6", start: 968.33, dur: 17.27, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_agujero_guia.mp4" hue="red" clipDur={2.5} /> },
  { key: "usos_0", start: 985.6, dur: 76.32, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Bajo los trenes","heading":"Durmientes","body":"para que se usaba esta madera cuando se necesitaba algo que no","media":"vid/qb_u_durmientes.mp4"},{"eyebrow":"En las calles","heading":"Adoquines de madera","body":"algunas ciudades pavimentaban las calles con tacos de madera","media":"vid/qb_u_adoquines.mp4"},{"eyebrow":"Bajo el agua","heading":"Pilotes de muelle","body":"aguantaba. Las ruedas de los carros, los","media":"vid/qb_u_pilotes.mp4"},{"eyebrow":"El golpe diario","heading":"Ruedas y mangos","body":"fallar, que iba a estar sometido al agua, al peso,","media":"vid/qb_u_ruedas.mp4"}]} /> },
  { key: "usos_1", start: 1061.92, dur: 4.37, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/qb_no_falla.mp4" words={parseQuote("Lo barato, a la larga, *siempre sale caro*.")} hue="blue" /> },
  { key: "faq_0", start: 1066.29, dur: 16.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_faq.png" hue="blue" kicker="Las dudas de siempre" /> },
  { key: "faq_1", start: 1082.3, dur: 64.03, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"¿De verdad?","heading":"¿Dura 100 años?","body":"documentados de más de un siglo, todavía","media":"vid/qb_q_cien.mp4"},{"eyebrow":"Entonces...","heading":"¿Por qué no se usa hoy?","body":"se agoto la fácil, crece lentísimo","media":"vid/qb_q_hoy.mp4"},{"eyebrow":"Lo mejor","heading":"¿Puedo plantar una?","body":"¿Puedo plantar una? Sí, y deberías","media":"vid/qb_q_plantar.mp4"}]} /> },
  { key: "caveat_0", start: 1146.33, dur: 18.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_sincero.png" hue="red" /> },
  { key: "caveat_1", start: 1164.93, dur: 18.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_monte_agotado.mp4" hue="amber" clipDur={2.5} /> },
  { key: "caveat_2", start: 1183.53, dur: 18.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_rama_caida.mp4" hue="blue" clipDur={2.5} /> },
  { key: "caveat_3", start: 1202.14, dur: 18.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_plantar.mp4" hue="red" clipDur={2.5} /> },
  { key: "cta_0", start: 1220.74, dur: 25.34, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/cta_0.mp4" items={[{"png":"img/qb_cut_aceite.png","title":"Aceite"},{"png":"img/qb_cut_borato.png","title":"Borato"},{"png":"img/qb_cut_fuego.png","title":"Fuego"},{"png":"img/qb_cut_cal.png","title":"Cal"}]} side="right" eyebrow="Blindá tu madera barata" /> },
  { key: "cta_1", start: 1246.08, dur: 12.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_aceite_pincel.mp4" hue="blue" clipDur={2.5} /> },
  { key: "cta_2", start: 1258.76, dur: 12.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_borato_tratar.mp4" hue="red" clipDur={2.5} /> },
  { key: "cta_3", start: 1271.43, dur: 12.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_fuego_chamuscar.mp4" hue="amber" clipDur={2.5} /> },
  { key: "cta_4", start: 1284.1, dur: 12.67, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/qb_tanino_hervido.mp4" hue="blue" clipDur={2.5} /> },
  { key: "cta_5", start: 1296.77, dur: 10.56, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy","value":27,"winner":true}]} title="El valor" unit="US$" hue="red" /> },
  { key: "cta_6", start: 1307.33, dur: 8.87, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/qb_manual_celular.mp4" words={parseQuote("Que tu madera de dos pesos dure *como una de cien años*.")} accent="good" hue="amber" /> },
  { key: "coment_0", start: 1316.2, dur: 19.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_camara.png" hue="blue" kicker="¿Cuál es la madera eterna de tu zona?" /> },
  { key: "coment_1", start: 1335.95, dur: 13.17, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"mapa"},{"t":"de"},{"t":"las"},{"t":"maderas"},{"t":"eternas","hl":true}]} eyebrow="Quebracho, ñandubay, lapacho, algarrobo?" hue="amber" bg="grid" /> },
  { key: "cierre_0", start: 1349.12, dur: 8.02, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/qb_arbol_dorado.mp4" words={parseQuote("La madera que dura es la que *nadie apuró*.")} hue="red" /> },
  { key: "cierre_1", start: 1357.14, dur: 7.64, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Plantá"},{"t":"un"},{"t":"árbol"},{"t":"que"},{"t":"dure"},{"t":"más"},{"t":"que"},{"t":"vos","hl":true}]} eyebrow="Cuida la que dura" hue="amber" bg="image" image="vid/qb_cierre_plantar.mp4" /> },
  { key: "cierre_2", start: 1364.78, dur: 19.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/qb_tomas_firma.png" hue="blue" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":17.15,"role":"popUp","vol":0.32},{"at":148.18,"role":"popUp","vol":0.32},{"at":183.84,"role":"popUp","vol":0.32},{"at":188.6,"role":"popUp","vol":0.32},{"at":265.66,"role":"popUp","vol":0.32},{"at":276.45,"role":"popUp","vol":0.32},{"at":289.98,"role":"popUp","vol":0.32},{"at":330.58,"role":"popUp","vol":0.32},{"at":407.72,"role":"popUp","vol":0.32},{"at":475.84,"role":"popUp","vol":0.32},{"at":534.62,"role":"popUp","vol":0.32},{"at":568.17,"role":"popUp","vol":0.32},{"at":675.92,"role":"popUp","vol":0.32},{"at":786.04,"role":"popUp","vol":0.32},{"at":856.54,"role":"popUp","vol":0.32},{"at":985.6,"role":"popUp","vol":0.32},{"at":1061.92,"role":"popUp","vol":0.32},{"at":1082.3,"role":"popUp","vol":0.32},{"at":1220.74,"role":"popUp","vol":0.32},{"at":1296.77,"role":"popUp","vol":0.32},{"at":1307.33,"role":"popUp","vol":0.32},{"at":1335.95,"role":"popUp","vol":0.32},{"at":1349.12,"role":"popUp","vol":0.32},{"at":1357.14,"role":"popUp","vol":0.32}];
