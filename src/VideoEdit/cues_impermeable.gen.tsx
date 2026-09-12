// cues_impermeable.gen.tsx — GENERADO por beatsheet.mjs desde impermeable.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/impermeable.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ScrollDoc } from "./scenes/ScrollDoc";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { HalfShot } from "./scenes/HalfShot";

const D = COLORS.danger, A = COLORS.accent, G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 4.32, dur: 9.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_agua_perla.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_2", start: 14, dur: 5.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_gotas_ruedan.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_3", start: 19.56, dur: 5.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_pino_corralon.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_4", start: 25.12, dur: 7.08, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_tabla_hinchada.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_5", start: 32.2, dur: 12.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_frasco_silicona.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_6", start: 44.95, dur: 12.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_pincelada_seca.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_7", start: 57.71, dur: 12.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_gondola_cara.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_8", start: 70.46, dur: 2.53, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Impermeabiliza"},{"t":"TODO"},{"t":"en"},{"t":"5"},{"t":"minutos","hl":true}]} eyebrow="Menos de dos pesos" hue="red" bg="image" image="vid/im_hook_super.mp4" /> },
  { key: "hook_9", start: 72.99, dur: 3.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_carton_hook.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_10", start: 76.8, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_botas_hook.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_11", start: 80.6, dur: 3.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_hook.png" hue="red" kicker="El invento de $2" /> },
  { key: "entender_0", start: 84.4, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_serio.png" hue="blue" /> },
  { key: "entender_1", start: 87.85, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_cerca_podrida.mp4" hue="red" clipDur={2.5} /> },
  { key: "entender_2", start: 91.3, dur: 3.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_deck_gris.mp4" hue="amber" clipDur={2.5} /> },
  { key: "entender_3", start: 94.74, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_puerta_hinchada.mp4" hue="blue" clipDur={2.5} /> },
  { key: "entender_4", start: 98.19, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_carton_humedo.mp4" hue="red" clipDur={2.5} /> },
  { key: "entender_5", start: 101.64, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_lona_picada.mp4" hue="amber" clipDur={2.5} /> },
  { key: "entender_6", start: 105.09, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_botas_empapadas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "entender_7", start: 108.54, dur: 3.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_herramienta_oxida.mp4" hue="red" clipDur={2.5} /> },
  { key: "entender_8", start: 111.98, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_pared_salitre.mp4" hue="amber" clipDur={2.5} /> },
  { key: "entender_9", start: 115.43, dur: 2.53, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Todo lo arruina el agua" items={["Madera que se pudre","Carton que se deshace","Tela que se pica","Metal que se oxida"]} accent={D} /> },
  { key: "entender_10", start: 117.96, dur: 6.73, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Un"},{"t":"solo"},{"t":"culpable:"},{"t":"el"},{"t":"agua","hl":true}]} eyebrow="El 90% de lo que se arruina" hue="red" bg="image" image="vid/im_agua_culpable.mp4" /> },
  { key: "entender_11", start: 124.69, dur: 16.17, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/entender_11.mp4" pages={[{"image":"img/dg_im_secar.png","eyebrow":"La madera se pudre cuando queda mojada, no por mojarse"}]} /> },
  { key: "entender_12", start: 140.86, dur: 10.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_poste_podrido_abajo.mp4" hue="blue" clipDur={2.5} /> },
  { key: "entender_13", start: 150.96, dur: 33.4, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/im_maestro_manos.mp4" words={parseQuote("La madera se pudre cuando *queda mojada*.")} hue="red" /> },
  { key: "mezcla_0", start: 184.36, dur: 7.62, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Solo dos cosas" items={["Silicona de cartucho","Disolvente universal"]} accent={A} /> },
  { key: "mezcla_1", start: 191.98, dur: 9.01, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/im_silicona_cartucho.mp4" side="right" kicker="1 · Silicona (la mas barata)" hue="amber" /> },
  { key: "mezcla_2", start: 200.99, dur: 9.01, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/im_disolvente.mp4" side="right" kicker="2 · Disolvente universal" hue="blue" /> },
  { key: "mezcla_3", start: 210, dur: 10.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_poner_silicona.mp4" hue="red" clipDur={2.5} /> },
  { key: "mezcla_4", start: 220.4, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_agregar_disolvente.mp4" hue="amber" clipDur={2.5} /> },
  { key: "mezcla_5", start: 225.08, dur: 4.69, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_revolver_frasco.mp4" hue="blue" clipDur={2.5} /> },
  { key: "mezcla_6", start: 229.77, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_pegote_silicona.mp4" hue="red" clipDur={2.5} /> },
  { key: "mezcla_7", start: 234.45, dur: 4.69, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_liquido_listo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "mezcla_8", start: 239.14, dur: 4.06, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/im_poner_silicona.png" annotations={[{"kind":"circle","x":40,"y":50,"label":"Silicona"},{"kind":"arrow","x":70,"y":45,"label":"Disolvente"}]} eyebrow="Dos cosas, nada mas" caption="Silicona de cartucho + disolvente universal" hue="blue" /> },
  { key: "mezcla_9", start: 243.2, dur: 33.31, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="1 : 3" image="vid/im_consistencia_leche.mp4" caption="Una parte de silicona, tres o cuatro de disolvente." hue="red" /> },
  { key: "seguridad1_0", start: 276.51, dur: 13.16, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El disolvente es INFLAMABLE" items={[{"text":"Lugar ventilado, puerta abierta","state":"done"},{"text":"Lejos de toda llama o chispa","state":"done"},{"text":"Guantes puestos","state":"done"}]} hue="amber" /> },
  { key: "seguridad1_1", start: 289.67, dur: 16.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_ventilado.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ciencia_0", start: 306.13, dur: 14.38, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/ciencia_0.mp4" pages={[{"image":"img/dg_im_capilar.png","eyebrow":"Sin tratar: el agua penetra y pudre"},{"image":"img/dg_im_perla.png","eyebrow":"Con la pelicula: el agua se hace bolita y rueda"}]} /> },
  { key: "ciencia_1", start: 320.51, dur: 8.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_capilaridad.mp4" hue="red" clipDur={2.5} /> },
  { key: "ciencia_2", start: 329.26, dur: 7.58, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/im_capilaridad.png" annotations={[{"kind":"arrow","x":45,"y":40,"label":"El agua penetra"}]} eyebrow="El agua entra por capilaridad" caption="Se mete en los poros y hincha la fibra" hue="amber" /> },
  { key: "ciencia_3", start: 336.84, dur: 8.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_fibra_hincha.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ciencia_4", start: 345.59, dur: 14.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_gota_bolita.mp4" hue="red" clipDur={2.5} /> },
  { key: "ciencia_5", start: 360.25, dur: 7.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_hoja_loto.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ciencia_6", start: 367.44, dur: 7.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_repollo_rocio.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ciencia_7", start: 374.63, dur: 5.99, kind: "cross", el: (d) => <CrossSection durationInFrames={d} layers={[{"label":"Pelicula impermeable (el agua rueda)","color":"#6F8478","weight":1},{"label":"Fibra de la madera (sellada)","color":"#A9794A","weight":3},{"label":"Madera sana adentro","color":"#6E8B47","weight":2}]} eyebrow="Capa por capa" title="Que pasa en la superficie" hue="red" /> },
  { key: "ciencia_8", start: 380.62, dur: 7.19, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_veta_plastico.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ciencia_9", start: 387.81, dur: 4.79, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Parece"},{"t":"plastico."},{"t":"Es"},{"t":"madera","hl":true}]} eyebrow="Abajo, tu tabla de dos pesos" hue="blue" bg="image" image="vid/im_parece_marmol.mp4" /> },
  { key: "velocidad_0", start: 392.6, dur: 18.57, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Barniz / pintura","value":24,"tone":"danger"},{"label":"Este invento","value":1,"winner":true}]} title="Cuanto tarda en secar" unit="h" hue="red" /> },
  { key: "velocidad_1", start: 411.17, dur: 6.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_seca_rapido.mp4" hue="amber" clipDur={2.5} /> },
  { key: "velocidad_2", start: 417.82, dur: 4.43, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={5} suffix=" min" label="y ya esta seco al tacto y listo para el agua" eyebrow="Velocidad" hue="blue" /> },
  { key: "velocidad_3", start: 422.25, dur: 4.43, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/im_seca_rapido.mp4" title="Vs 24 horas del barniz" chips={["Se evapora","Seca solo","Listo para el agua"]} hue="blue" /> },
  { key: "velocidad_4", start: 426.68, dur: 4.87, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Preparar","desc":"silicona + disolvente","image":"img/im_p_preparar.png"},{"title":"Pincelar","desc":"una mano finita","image":"img/im_p_pincelar.png"},{"title":"Secar","desc":"5-10 minutos","image":"img/im_p_secar.png"},{"title":"2a mano","desc":"si sufre mucho","image":"img/im_p_segunda.png"}]} eyebrow="Simple" title="Como se aplica" hue="amber" /> },
  { key: "velocidad_5", start: 431.55, dur: 6.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_mano_pareja.mp4" hue="blue" clipDur={2.5} /> },
  { key: "demo_0", start: 438.2, dur: 18.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_media_tabla.mp4" hue="amber" clipDur={2.5} /> },
  { key: "demo_1", start: 456.82, dur: 1.95, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_echar_agua.mp4" hue="blue" clipDur={2.5} /> },
  { key: "demo_2", start: 458.77, dur: 4.59, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/im_frontera.png" annotations={[{"kind":"arrow","x":30,"y":45,"label":"Cruda: empapa"},{"kind":"arrow","x":70,"y":45,"label":"Tratada: resbala"}]} eyebrow="La frontera que convence" caption="Tratada resbala · cruda se empapa" hue="red" /> },
  { key: "demo_3", start: 463.36, dur: 5.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_mitad_cruda.mp4" hue="amber" clipDur={2.5} /> },
  { key: "demo_4", start: 468.65, dur: 5.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_gotas_bonitas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "demo_5", start: 473.94, dur: 13.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_dedo_seco.mp4" hue="red" clipDur={2.5} /> },
  { key: "demo_6", start: 487.17, dur: 13.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_misma_tabla.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_madera_0", start: 500.4, dur: 11.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_superficies.png" hue="blue" kicker="Superficie por superficie" /> },
  { key: "sf_madera_1", start: 512.33, dur: 11.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_deck.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_madera_2", start: 524.25, dur: 11.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_aglomerado.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_madera_3", start: 536.18, dur: 11.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_aglomerado_ok.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_madera_4", start: 548.11, dur: 7.95, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/im_sf_deck.mp4" title="Toda madera a la intemperie" chips={["Deck y cerca","Postes","Muebles de patio","Mangos de herramientas"]} hue="amber" /> },
  { key: "sf_carton_0", start: 556.06, dur: 24.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_carton_aislante.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_carton_1", start: 581, dur: 15.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_carton_agua.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_carton_2", start: 596.93, dur: 15.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_carton_crudo.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_carton_3", start: 612.87, dur: 15.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_carton_seco.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_papel_0", start: 628.8, dur: 15.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_papel_gotas.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_papel_1", start: 644.27, dur: 15.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_papel_etiquetas.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_papel_2", start: 659.73, dur: 15.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_papel_crudo.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_tela_0", start: 675.2, dur: 20.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_lona.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_tela_1", start: 695.8, dur: 20.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_encerado.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_tela_2", start: 716.4, dur: 20.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_toldo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_cuero_0", start: 737, dur: 15.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_botas.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_cuero_1", start: 752.2, dur: 15.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_cuero_cera.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_cuero_2", start: 767.4, dur: 15.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_montura.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_barro_0", start: 782.6, dur: 20.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_maceta_rajada.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sf_barro_1", start: 802.8, dur: 8.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_maceta_repele.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_barro_2", start: 811.28, dur: 8.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_ladrillo.mp4" hue="red" clipDur={2.5} /> },
  { key: "sf_metal_0", start: 819.77, dur: 18.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_metal_film.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sf_metal_1", start: 838.62, dur: 18.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_sf_herramientas.mp4" hue="red" clipDur={2.5} /> },
  { key: "metodos_0", start: 857.47, dur: 21.17, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_metodos.png" hue="red" kicker="Un metodo para cada uso" /> },
  { key: "metodos_1", start: 878.64, dur: 84.7, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"El estrella","heading":"Silicona + disolvente","body":"una vela común o cera de abeja en agua rastibio, con muchísimo cuidado porque es inflamable, siempre a baño María, nunca al fuego directo.","media":"vid/im_m_silicona.mp4"},{"eyebrow":"Natural","heading":"Cera disuelta","body":"de linaza. Derretís cera de abeja, la mezclás con aceite de linaza y te queda una pasta, una manteca de madera. Esa pasta la","media":"vid/im_m_cera.mp4"},{"eyebrow":"Para lo que tocas","heading":"Cera de abeja + aceite","body":"Sin olor a solvente, sin tóxicos. Metodo 4, para restaurar además de impermeabilizar, aceite de linaza con trementina.","media":"vid/im_m_ceraaceite.mp4"},{"eyebrow":"Para restaurar","heading":"Aceite de linaza + trementina","body":"un video entero, pero quédate con esto. El aceite penetra y restaura, la silicona sella por arriba y repele. Para madera","media":"vid/im_m_linaza.mp4"}]} /> },
  { key: "metodos_2", start: 963.34, dur: 15.53, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="El criterio" items={["Rapido y barato: silicona","Comida o piel: cera+aceite","Madera vieja: linaza","Cuero: cera o grasa"]} accent={G} /> },
  { key: "usos_0", start: 978.87, dur: 17.82, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_u_mimbre.mp4" hue="amber" clipDur={2.5} /> },
  { key: "usos_1", start: 996.69, dur: 17.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_u_soga.mp4" hue="blue" clipDur={2.5} /> },
  { key: "usos_2", start: 1014.5, dur: 17.82, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_u_bote.mp4" hue="red" clipDur={2.5} /> },
  { key: "usos_3", start: 1032.32, dur: 17.82, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_u_adobe.mp4" hue="amber" clipDur={2.5} /> },
  { key: "usos_4", start: 1050.14, dur: 17.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_u_colmena.mp4" hue="blue" clipDur={2.5} /> },
  { key: "usos_5", start: 1067.95, dur: 11.88, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/im_u_mimbre.mp4" title="Cualquier cosa porosa" chips={["Mimbre y paja","Soga","Bote","Adobe"]} hue="amber" /> },
  { key: "faq_0", start: 1079.83, dur: 32.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_faq.png" hue="blue" kicker="Las dudas, una por una" /> },
  { key: "faq_1", start: 1112.79, dur: 21.97, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Las"},{"t":"dudas"},{"t":"reales"},{"t":"que"},{"t":"te"},{"t":"frenan","hl":true}]} eyebrow="Una por una" hue="amber" bg="grid" /> },
  { key: "faq_2", start: 1134.76, dur: 131.84, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Duracion","heading":"Cuanto dura?","body":"de la gota es tu tablero de control, la haces en dos segundos. Tercera, ¿aguanta el sol? ¿No se reseca? Aguanta","media":"vid/im_q_dura.mp4"},{"eyebrow":"La prueba de la gota","heading":"Cuando renovar?","body":"feas, y tenés que lijar todo para arreglarlo. Esto no se descascara, simplemente se va gastando parejo. Y renovarlo es dar otra mano encima, sin","media":"vid/im_q_renovar.mp4"},{"eyebrow":"El sol","heading":"Aguanta el sol?","body":"con la humedad, ninguna película dura para siempre, porque es el ataque más bravo que existe. Para los postes, lo mejor es combinar. Tratás","media":"vid/im_q_sol.mp4"},{"eyebrow":"Bajo tierra","heading":"Sirve enterrado?","body":"la única. Quinta, ¿cuándo seca es tóxico? ¿Puedo tenerlo cerca de las plantas, de los animales? Cuando el disolvente se","media":"vid/im_q_enterrado.mp4"},{"eyebrow":"Cuando seca","heading":"Es toxico?","body":"el disolvente. Una vez seco y aireado, para un gallinero o una maceta, no hay drama. Pero repito, para lo que toca comida directamente,","media":"vid/im_q_toxico.mp4"},{"eyebrow":"Sobre pintura","heading":"Sobre barniz viejo?","body":"sí, le da una capa que repele agua encima. Pero si la pintura vieja está descascarada, saltada, primero hay que sacarlo suelto, porque","media":"vid/im_q_pintura.mp4"},{"eyebrow":"El auto","heading":"Sirve para vidrios?","body":"parabrisas? Mira, la idea es la misma, la de que el agua rebote, y hay productos específicos para vidrio que hacen justo eso. Pero para el auto, usa el producto de vidrio,","media":"vid/im_q_auto.mp4"}]} /> },
  { key: "plata_0", start: 1266.6, dur: 18.23, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Impermeabilizante de marca","value":40,"tone":"danger"},{"label":"Casero (litros)","value":2,"winner":true}]} title="Lo que ahorras" unit="US$" hue="red" /> },
  { key: "plata_1", start: 1284.83, dur: 21.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_gondola_frascos.mp4" hue="amber" clipDur={2.5} /> },
  { key: "plata_2", start: 1306.71, dur: 15.32, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/im_frasco_barato.mp4" words={parseQuote("Un tarrito casero = *veinte frascos de marca*.")} accent="danger" hue="blue" /> },
  { key: "trucos_0", start: 1322.03, dur: 98.72, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Que dure meses","heading":"Guardar la mezcla","body":"trucos finos de artesano, de esos que hacen la diferencia entre que te salga bien y que te salga perfecto. Primero, ¿cómo guardar la mezcla? No prepares de a poquito","media":"vid/im_t_guardar.mp4"},{"eyebrow":"Mate o satinado","heading":"El acabado","body":"cada vez que lo necesitas, lo revolvés un poco y a trabajar. Un frasco preparado es tener el impermeabilizante siempre listo. Segundo, el acabado.","media":"vid/im_t_acabado.mp4"},{"eyebrow":"Dia templado","heading":"Temperatura y momento","body":"algo de trabajo, el brillo no importa. Para un mueble lindo, mezcla más suave y va a quedar natural. Tercero, la temperatura y el momento.","media":"vid/im_t_temperatura.mp4"},{"eyebrow":"Mejor que pincel","heading":"El trapo","body":"suave después de aplicar, el sol tibio o un secador de pelo a distancia, ayuda a que la película se meta bien. Nunca calor fuerte ni llama,","media":"vid/im_t_trapo.mp4"}]} /> },
  { key: "trucos_1", start: 1420.75, dur: 16.45, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="OJO" image="vid/im_t_trapos_secar.mp4" caption="Los trapos con solvente, extendidos afuera. Nunca en bollo." accent="danger" hue="blue" /> },
  { key: "errores_0", start: 1437.2, dur: 104.2, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Error 1","heading":"Mano demasiado gruesa","body":"Ahora los errores. Porque puedo darte la mejor mezcla del mundo, pero si la aplicás mal, no te va a funcionar, y vas a pensar que es mentira. Estos","media":"vid/im_e_gruesa.mp4"},{"eyebrow":"Error 2","heading":"Superficie mojada o sucia","body":"y otra, protegen muchísimo más que una gruesa. La madera toma lo que necesita, el exceso solo hace desastre. Error 2. Aplicar sobre superficie","media":"vid/im_e_mojada.mp4"},{"eyebrow":"Error 3","heading":"Pintar despues","body":"adentro, nunca. Error 3. Usarlo donde después vas a pintar o pegar. Ojo con esto. Una superficie tratada","media":"vid/im_e_pintar.mp4"},{"eyebrow":"Error 4","heading":"En lo que toca comida","body":"Error 4. Usarlo en lo que toca comida o en interiores sin ventilar. Para la tabla de cortar, para la mesada de la cocina, para un juguete,","media":"vid/im_e_comida.mp4"}]} /> },
  { key: "ocultan_0", start: 1541.4, dur: 10.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_barnices_publicidad.mp4" hue="red" clipDur={2.5} /> },
  { key: "ocultan_1", start: 1552, dur: 10.6, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_spray_lindo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ocultan_2", start: 1562.6, dur: 10.59, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_frasco_gasta.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ocultan_3", start: 1573.19, dur: 7.07, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/im_spray_lindo.mp4" title="El negocio del reemplazo" chips={["Se descascara","Recomprás","Cada año"]} hue="red" /> },
  { key: "ocultan_4", start: 1580.26, dur: 8.91, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/im_industria.mp4" words={parseQuote("Ellos viven de que *vuelvas a comprar*.")} accent="danger" hue="amber" /> },
  { key: "ocultan_5", start: 1589.17, dur: 12.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_abuelo_lona.mp4" hue="blue" clipDur={2.5} /> },
  { key: "ocultan_6", start: 1601.91, dur: 8.49, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Las"},{"t":"fabricas"},{"t":"nos"},{"t":"van"},{"t":"a"},{"t":"linchar","hl":true}]} eyebrow="El dia que esto se sepa" hue="red" bg="image" image="vid/im_linchar.mp4" /> },
  { key: "historia_0", start: 1610.4, dur: 12.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_h_barco.mp4" hue="amber" clipDur={2.5} /> },
  { key: "historia_1", start: 1623.32, dur: 12.91, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_h_encerado.mp4" hue="blue" clipDur={2.5} /> },
  { key: "historia_2", start: 1636.23, dur: 12.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/im_h_gaucho.mp4" hue="red" clipDur={2.5} /> },
  { key: "historia_3", start: 1649.15, dur: 8.61, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/im_h_barco.mp4" title="Lo NUEVO es el spray caro" chips={["Brea: 5000 anos","Cera: milenios","Spray: ayer"]} hue="amber" /> },
  { key: "historia_4", start: 1657.76, dur: 9.48, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Cinco mil anos ganandole al agua" items={["Brea en los barcos","Cera de abeja","Aceite y grasa","Sebo en el cuero"]} accent={A} /> },
  { key: "historia_5", start: 1667.24, dur: 10.33, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="Cinco mil anos ganandole al agua" lines={[{"text":"Brea, cera, aceite, grasa.","mark":true},{"text":"El spray caro de la ferreteria es lo NUEVO."}]} image="vid/im_h_lona_carro.mp4" hue="red" /> },
  { key: "cta_0", start: 1677.57, dur: 20.85, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/cta_0.mp4" pages={[{"image":"img/dg_im_manual.png","eyebrow":"Las medidas por superficie + 39 arreglos mas"}]} /> },
  { key: "cta_1", start: 1698.42, dur: 10.86, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy","value":27,"winner":true}]} title="El valor" unit="US$" hue="red" /> },
  { key: "cta_2", start: 1709.28, dur: 9.12, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/im_manual_celular.mp4" words={parseQuote("Con impermeabilizar una lona, *ya lo pagaste*.")} accent="good" hue="amber" /> },
  { key: "coment_0", start: 1718.4, dur: 11.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_camara.png" hue="red" kicker="Que vas a impermeabilizar?" /> },
  { key: "coment_1", start: 1729.44, dur: 7.36, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Que"},{"t":"truco"},{"t":"usaban"},{"t":"en"},{"t":"tu"},{"t":"zona","hl":true}]} eyebrow="Grasa, cera, brea, aceite quemado?" hue="amber" bg="grid" /> },
  { key: "cierre_0", start: 1736.8, dur: 6.41, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/im_madera_dorada.mp4" words={parseQuote("La independencia se prepara *con las manos*.")} hue="amber" /> },
  { key: "cierre_1", start: 1743.21, dur: 6.1, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Que"},{"t":"el"},{"t":"agua"},{"t":"resbale","hl":true}]} eyebrow="Cuida lo tuyo" hue="blue" bg="image" image="vid/im_cierre_gota.mp4" /> },
  { key: "cierre_2", start: 1749.31, dur: 15.57, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/im_tomas_firma.png" hue="red" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":70.46,"role":"popUp","vol":0.32},{"at":115.43,"role":"popUp","vol":0.32},{"at":117.96,"role":"popUp","vol":0.32},{"at":124.69,"role":"popUp","vol":0.32},{"at":150.96,"role":"popUp","vol":0.32},{"at":184.36,"role":"popUp","vol":0.32},{"at":191.98,"role":"popUp","vol":0.32},{"at":200.99,"role":"popUp","vol":0.32},{"at":239.14,"role":"popUp","vol":0.32},{"at":243.2,"role":"popUp","vol":0.32},{"at":276.51,"role":"popUp","vol":0.32},{"at":306.13,"role":"popUp","vol":0.32},{"at":329.26,"role":"popUp","vol":0.32},{"at":374.63,"role":"popUp","vol":0.32},{"at":387.81,"role":"popUp","vol":0.32},{"at":392.6,"role":"popUp","vol":0.32},{"at":417.82,"role":"popUp","vol":0.32},{"at":422.25,"role":"popUp","vol":0.32},{"at":426.68,"role":"popUp","vol":0.32},{"at":458.77,"role":"popUp","vol":0.32},{"at":548.11,"role":"popUp","vol":0.32},{"at":878.64,"role":"popUp","vol":0.32},{"at":963.34,"role":"popUp","vol":0.32},{"at":1067.95,"role":"popUp","vol":0.32},{"at":1112.79,"role":"popUp","vol":0.32},{"at":1134.76,"role":"popUp","vol":0.32},{"at":1266.6,"role":"popUp","vol":0.32},{"at":1306.71,"role":"popUp","vol":0.32},{"at":1322.03,"role":"popUp","vol":0.32},{"at":1420.75,"role":"popUp","vol":0.32},{"at":1437.2,"role":"popUp","vol":0.32},{"at":1573.19,"role":"popUp","vol":0.32},{"at":1580.26,"role":"popUp","vol":0.32},{"at":1601.91,"role":"popUp","vol":0.32},{"at":1649.15,"role":"popUp","vol":0.32},{"at":1657.76,"role":"popUp","vol":0.32},{"at":1667.24,"role":"popUp","vol":0.32},{"at":1677.57,"role":"popUp","vol":0.32},{"at":1698.42,"role":"popUp","vol":0.32},{"at":1709.28,"role":"popUp","vol":0.32},{"at":1729.44,"role":"popUp","vol":0.32},{"at":1736.8,"role":"popUp","vol":0.32},{"at":1743.21,"role":"popUp","vol":0.32}];
