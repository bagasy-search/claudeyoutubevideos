// cues_maderarest.gen.tsx — GENERADO por beatsheet.mjs desde maderarest.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/maderarest.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { AgedDoc } from "./scenes/AgedDoc";
import { BarCompare } from "./scenes/BarCompare";
import { CrossSection } from "./scenes/CrossSection";
import { Checklist } from "./scenes/Checklist";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { CalloutMark } from "./scenes/CalloutMark";
import { HalfShot } from "./scenes/HalfShot";

const A = COLORS.accent, G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 5.22, dur: 7.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_liquido_macro.mp4" hue="red" kicker="Menos de un dólar" clipDur={4} /> },
  { key: "hook_2", start: 12.64, dur: 4.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_veta_revive.mp4" hue="blue" clipDur={3} /> },
  { key: "hook_3", start: 17, dur: 4.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_cerca_podrida.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_4", start: 21.36, dur: 5.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_cerca_restaurada.mp4" hue="red" clipDur={2.5} /> },
  { key: "hook_5", start: 26.67, dur: 5.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_terraza_vieja.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_6", start: 31.97, dur: 5.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_mueble_basura.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_7", start: 37.28, dur: 7.77, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Sin"},{"t":"lijar,"},{"t":"sin"},{"t":"herramientas,"},{"t":"sin"},{"t":"experiencia","hl":true}]} eyebrow="Nada complicado" hue="red" bg="image" image="vid/mr_mueble_exhibicion.mp4" /> },
  { key: "hook_8", start: 45.05, dur: 11.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_artesanos_30.mp4" hue="blue" clipDur={2.5} /> },
  { key: "hook_9", start: 56.71, dur: 11.66, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_ebanistas_sepia.mp4" hue="amber" clipDur={2.5} /> },
  { key: "hook_10", start: 68.37, dur: 2.43, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/mr_botella_enterrada.png" words={parseQuote("La enterraron porque *funcionaba demasiado bien*.")} accent="danger" hue="red" /> },
  { key: "ident_0", start: 70.8, dur: 4.73, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/mr_tomas_retrato.png" hue="red" kicker="Tomás" /> },
  { key: "ident_1", start: 75.53, dur: 1.86, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Hoy"},{"t":"la"},{"t":"desenterramos"},{"t":"—"},{"t":"con"},{"t":"las"},{"t":"medidas exactas","hl":true}]} eyebrow="Completa" hue="blue" bg="image" image="vid/mr_tres_frascos_mesa.mp4" /> },
  { key: "entender_0", start: 77.39, dur: 3.45, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/mr_tomas_serio.png" hue="blue" kicker="Entendé esto primero" /> },
  { key: "entender_1", start: 80.84, dur: 3.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_madera_fallo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "gris_0", start: 84.3, dur: 8, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/gris_0.mp4" pages={[{"image":"img/dg_mr_gris.png","eyebrow":"El sol rompe la fibra, la lluvia se la lleva"}]} /> },
  { key: "gris_1", start: 92.3, dur: 5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_sol_tabla.mp4" hue="red" clipDur={2.5} /> },
  { key: "gris_2", start: 97.3, dur: 3.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_lluvia_madera.mp4" hue="blue" clipDur={2.5} /> },
  { key: "gris_3", start: 101.15, dur: 3.33, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/mr_fibra_gris.png" annotations={[{"kind":"arrow","x":40,"y":35,"label":"Fibra levantada"},{"kind":"circle","x":62,"y":62,"label":"Sin aceite"}]} eyebrow="Madera muerta por fuera" caption="Fibra seca, sin una gota de aceite" hue="amber" /> },
  { key: "gris_4", start: 104.48, dur: 3.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_banco_gris.mp4" hue="red" clipDur={2.5} /> },
  { key: "gris_5", start: 108.33, dur: 3.19, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/mr_fibra_gris.mp4" title="Madera sedienta" chips={["Seca","Apagada","Sin una gota de aceite"]} hue="amber" /> },
  { key: "lijar_0", start: 111.52, dur: 7.57, kind: "cross", el: (d) => <CrossSection durationInFrames={d} layers={[{"label":"Barniz (capa de plástico)","color":"#A9794A","weight":1},{"label":"Madera muerta (sigue gris)","color":"#6F8478","weight":3},{"label":"Madera sana","color":"#6E8B47","weight":2}]} eyebrow="Qué pasa por dentro" title="Barnizar = tapar el problema" hue="red" /> },
  { key: "lijar_1", start: 119.09, dur: 4.41, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_barniz_descascara.mp4" hue="blue" clipDur={3} /> },
  { key: "lijar_2", start: 123.5, dur: 4.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_veta_tapada.mp4" hue="amber" clipDur={2.5} /> },
  { key: "lijar_3", start: 127.9, dur: 8.7, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/mr_aceite_absorbe.mp4" words={parseQuote("Los viejos hacían al revés: *alimentaban* la madera.")} hue="red" /> },
  { key: "tres_0", start: 136.6, dur: 2.44, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Cada una hace algo distinto" items={["Vinagre — despierta la fibra","Linaza — nutre por dentro","Trementina — empuja el aceite"]} accent={A} /> },
  { key: "tres_1", start: 139.04, dur: 3.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_tres_frascos_close.mp4" hue="amber" clipDur={2.5} /> },
  { key: "tres_2", start: 142.38, dur: 2.22, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/mr_tres_frascos_mesa.mp4" title="Cada una hace algo distinto" chips={["Vinagre despierta","Linaza nutre","Trementina penetra"]} hue="amber" /> },
  { key: "vinagre_0", start: 144.6, dur: 2.4, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/mr_vinagre_frasco.mp4" side="right" kicker="1 · Vinagre blanco" hue="amber" /> },
  { key: "vinagre_1", start: 147, dur: 5.24, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/vinagre_1.mp4" pages={[{"image":"img/dg_mr_vinagre.png","eyebrow":"Abre la fibra para que entre el aceite"}]} /> },
  { key: "vinagre_2", start: 152.24, dur: 9.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_vinagre_trapo.mp4" hue="blue" clipDur={3} /> },
  { key: "vinagre_3", start: 161.35, dur: 6.07, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="Paso 0" image="vid/mr_puerta_cerrada.mp4" caption="Sin esto, el aceite queda arriba y se pega." hue="amber" /> },
  { key: "linaza_0", start: 167.42, dur: 4.65, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/mr_linaza_frasco.mp4" side="right" kicker="2 · Aceite de linaza HERVIDO" hue="red" /> },
  { key: "linaza_1", start: 172.07, dur: 6.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_linaza_cruda_vs.mp4" hue="blue" clipDur={2.5} /> },
  { key: "linaza_2", start: 178.42, dur: 7.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_semillas_gel.mp4" hue="amber" clipDur={2.5} /> },
  { key: "linaza_3", start: 185.94, dur: 7.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_linaza_verter.mp4" hue="red" clipDur={2.5} /> },
  { key: "linaza_4", start: 193.46, dur: 7.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_ferreteria_estante.mp4" hue="blue" clipDur={2.5} /> },
  { key: "linaza_5", start: 200.99, dur: 5.01, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Hervido"},{"t":"es"},{"t":"solo"},{"t":"el"},{"t":"nombre","hl":true}]} eyebrow="No lo hervís vos" hue="amber" bg="image" image="vid/mr_etiqueta_boiled.mp4" /> },
  { key: "trementina_0", start: 206, dur: 3.46, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/mr_trementina_frasco.mp4" side="right" kicker="3 · Trementina (aguarrás)" hue="blue" /> },
  { key: "trementina_1", start: 209.46, dur: 7.55, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/trementina_1.mp4" pages={[{"image":"img/dg_mr_trementina.png","eyebrow":"Empuja el aceite adentro, no lo deja arriba"}]} /> },
  { key: "trementina_2", start: 217.01, dur: 4.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_aguarras_mexico.mp4" hue="red" clipDur={2.5} /> },
  { key: "proporciones_0", start: 221.73, dur: 7.56, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Las"},{"t":"proporciones"},{"t":"exactas","hl":true}]} eyebrow="Lo que casi nunca te dan" hue="amber" bg="image" image="vid/mr_jarro_midiendo.mp4" /> },
  { key: "proporciones_1", start: 229.29, dur: 11.34, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_partes_iguales.mp4" hue="red" clipDur={2.5} /> },
  { key: "proporciones_2", start: 240.63, dur: 9.5, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_agua_aceite.mp4" hue="blue" clipDur={2.5} /> },
  { key: "proporciones_3", start: 250.13, dur: 9.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_mezcla_revolver.mp4" hue="amber" clipDur={2.5} /> },
  { key: "recetas_0", start: 259.62, dur: 14.05, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/recetas_0.mp4" pages={[{"image":"img/dg_mr_receta1.png","eyebrow":"Restaurar: 1 parte aceite + 1 parte trementina"},{"image":"img/dg_mr_receta2.png","eyebrow":"Mantener: 2 partes aceite + 1 de trementina"}]} /> },
  { key: "recetas_1", start: 273.67, dur: 8.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_vinagre_primero.mp4" hue="blue" clipDur={2.5} /> },
  { key: "recetas_2", start: 282.45, dur: 5.85, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/mr_jarro_midiendo.mp4" title="Anotá esto" chips={["Restaurar 1:1","Mantener 2:1","El vinagre va aparte"]} hue="blue" /> },
  { key: "recetas_3", start: 288.3, dur: 7.43, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={90} suffix="%" label="de la madera de tu casa, ya lo arreglás con esto" eyebrow="Con dos fórmulas" hue="red" /> },
  { key: "cta1_0", start: 295.73, dur: 8.5, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/mr_manual_tabla.mp4" side="right" kicker="En el manual: la tabla al mililitro" hue="blue" /> },
  { key: "cta1_1", start: 304.23, dur: 18.53, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/cta1_1.mp4" pages={[{"image":"img/dg_mr_manual1.png","eyebrow":"Imprimís, pegás en el taller, listo"}]} /> },
  { key: "dudas_0", start: 322.76, dur: 6.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/mr_tomas_dudas.png" hue="amber" kicker="Las dudas, una por una" /> },
  { key: "dudas_1", start: 328.96, dur: 4.14, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Las"},{"t":"preguntas"},{"t":"que"},{"t":"siempre"},{"t":"quedan","hl":true}]} eyebrow="Una por una" hue="amber" bg="grid" /> },
  { key: "pegajosa_0", start: 333.1, dur: 7.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_madera_pegajosa.mp4" hue="red" clipDur={2.5} /> },
  { key: "pegajosa_1", start: 340.21, dur: 7.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_mucho_aceite.mp4" hue="blue" clipDur={2.5} /> },
  { key: "regla_0", start: 347.32, dur: 8.02, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/regla_0.mp4" pages={[{"image":"img/dg_mr_regla.png","eyebrow":"La madera toma lo que necesita; el resto lo sacás"}]} /> },
  { key: "regla_1", start: 355.34, dur: 5.39, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_trapo_retira.mp4" hue="amber" clipDur={3} /> },
  { key: "regla_2", start: 360.73, dur: 3.59, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={20} suffix=" min" label="y retirás con un trapo seco todo lo que no absorbió" eyebrow="Regla de oro" hue="red" /> },
  { key: "pintada_0", start: 364.32, dur: 10.61, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/mr_cruda_vs_barniz.png" annotations={[{"kind":"circle","x":30,"y":55,"label":"Cruda: SÍ"},{"kind":"arrow","x":72,"y":45,"label":"Barniz sano: NO"}]} eyebrow="¿En qué madera sirve?" caption="Solo en madera cruda o gastada, no sobre barniz sano" hue="amber" /> },
  { key: "pintada_1", start: 374.93, dur: 9.01, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_lijar_apenas.mp4" hue="red" clipDur={2.5} /> },
  { key: "comida_0", start: 383.94, dur: 7.08, kind: "half", el: (d) => <HalfShot durationInFrames={d} src="vid/mr_tabla_cortar.mp4" side="right" kicker="¿Mesa o tabla de cortar?" hue="red" /> },
  { key: "comida_1", start: 391.02, dur: 7.08, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="Para algo que toca comida" items={["Aceite de linaza PURO","Sin trementina","Curar 2-3 semanas"]} accent={G} /> },
  { key: "comida_2", start: 398.1, dur: 6.43, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={21} suffix=" días" label="de curado y queda una superficie sana para comer" eyebrow="Solo aceite" hue="amber" /> },
  { key: "afuera_0", start: 404.53, dur: 7.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_madera_intemperie.mp4" hue="blue" clipDur={3} /> },
  { key: "afuera_1", start: 412.18, dur: 5.09, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={50} suffix=" años" label="y sigue firme, con una mano de mantenimiento al año" eyebrow="Aguanta afuera" hue="amber" /> },
  { key: "afuera_2", start: 417.27, dur: 7.65, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_mantenimiento.mp4" hue="red" clipDur={2.5} /> },
  { key: "gasoil_0", start: 424.92, dur: 9.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_gasoil_garrafa.mp4" hue="amber" clipDur={2.5} /> },
  { key: "gasoil_1", start: 434.01, dur: 9.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_gasoil_mezcla.mp4" hue="red" clipDur={2.5} /> },
  { key: "gasoil_2", start: 443.11, dur: 9.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_postes_campo.mp4" hue="blue" clipDur={2.5} /> },
  { key: "gasoil_3", start: 452.2, dur: 4.22, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/mr_banco_plaza.mp4" words={parseQuote("Hay una *versión mejor* para cada cosa.")} hue="amber" /> },
  { key: "seguridad_0", start: 456.42, dur: 7.46, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Seguridad — no se negocia" items={[{"text":"Guantes puestos","state":"done"},{"text":"Lugar ventilado, puerta abierta","state":"done"},{"text":"Tomá descansos","state":"done"}]} hue="red" /> },
  { key: "seguridad_1", start: 463.88, dur: 9.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_guantes_ventilado.mp4" hue="blue" clipDur={2.5} /> },
  { key: "trapos_0", start: 473.2, dur: 6.28, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"trapo"},{"t":"puede"},{"t":"prenderse"},{"t":"fuego"},{"t":"solo","hl":true}]} eyebrow="Esto salva casas" hue="blue" bg="image" image="vid/mr_trapos_bollo.mp4" /> },
  { key: "trapos_1", start: 479.48, dur: 9.42, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_trapos_llama.mp4" hue="amber" clipDur={2.5} /> },
  { key: "trapos_2", start: 488.9, dur: 7.18, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_trapos_extendidos.mp4" hue="red" clipDur={2.5} /> },
  { key: "trapos_3", start: 496.08, dur: 4.78, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="¡OJO!" image="vid/mr_trapos_secos.mp4" caption="Nunca los tires en bollo. Extendelos afuera." accent="danger" hue="blue" /> },
  { key: "aplicacion_0", start: 500.86, dur: 4.62, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Cómo se aplica — 4 pasos" items={[{"text":"Limpiar: vinagre + cepillo, secar","state":"done"},{"text":"Aplicar la mezcla, en la veta","state":"done"},{"text":"Retirar el sobrante a los 20 min","state":"done"},{"text":"Secar un día por mano","state":"done"}]} hue="amber" /> },
  { key: "paso1_0", start: 505.48, dur: 11.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_paso1_vinagre.mp4" hue="red" clipDur={3} /> },
  { key: "paso1_1", start: 517.47, dur: 6.85, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Error"},{"t":"#1:"},{"t":"aceitar"},{"t":"madera"},{"t":"húmeda","hl":true}]} eyebrow="La pudrís desde adentro" hue="blue" bg="image" image="vid/mr_madera_humeda.mp4" /> },
  { key: "paso2_0", start: 524.32, dur: 9.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_paso2_transforma.mp4" hue="blue" clipDur={4} /> },
  { key: "paso2_1", start: 533.36, dur: 4.6, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/mr_sentido_veta.png" annotations={[{"kind":"arrow","x":50,"y":45,"label":"En la veta"}]} eyebrow="Siempre en el sentido de la veta" caption="La madera lo toma como una esponja" hue="amber" /> },
  { key: "paso2_2", start: 537.96, dur: 5.32, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_esponja.mp4" hue="red" clipDur={2.5} /> },
  { key: "paso3_0", start: 543.28, dur: 5.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_paso3_retira.mp4" hue="amber" clipDur={3} /> },
  { key: "paso3_1", start: 548.39, dur: 3.41, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="20 min" image="vid/mr_20min_reloj.mp4" caption="Lo que no absorbió, afuera." hue="red" /> },
  { key: "paso4_0", start: 551.8, dur: 5.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_paso4_secar.mp4" hue="red" clipDur={2.5} /> },
  { key: "paso4_1", start: 556.87, dur: 3.38, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={3} suffix=" manos" label="para un deck o mueble que sufre, un día entre cada una" eyebrow="Más capas, más fuerte" hue="blue" /> },
  { key: "paso4_2", start: 560.25, dur: 5.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_capas_profundo.mp4" hue="amber" clipDur={2.5} /> },
  { key: "todo_0", start: 565.32, dur: 5.32, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/mr_manos_abuelo.png" words={parseQuote("Esto es lo que sabía *tu abuelo*.")} hue="blue" /> },
  { key: "todo_1", start: 570.64, dur: 6.33, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Barniz de $30","value":1,"tone":"danger"},{"label":"Aceite de linaza","value":50,"winner":true}]} title="Cuánto dura" unit="años" hue="amber" /> },
  { key: "ocultaron_0", start: 576.97, dur: 3.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_barniz_publicidad.mp4" hue="amber" clipDur={2.5} /> },
  { key: "ocultaron_1", start: 580.59, dur: 2.9, kind: "aged", el: (d) => <AgedDoc durationInFrames={d} heading="El secreto de los abuelos" lines={[{"text":"No lo prohibieron.","mark":true},{"text":"Simplemente dejaron de enseñártelo."}]} image="vid/mr_manual_viejo_cajon.mp4" hue="red" /> },
  { key: "ocultaron_2", start: 583.49, dur: 2.42, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="1932" image="vid/mr_1932_archivo.mp4" caption="Cuando llegó el barniz que había que recomprar." hue="blue" /> },
  { key: "sinteticos_0", start: 585.91, dur: 7.39, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/mr_ferreteria_barniz.mp4" words={parseQuote("Duraba demasiado. *No les servía*.")} accent="danger" hue="red" /> },
  { key: "sinteticos_1", start: 593.3, dur: 10.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_barniz_recomprar.mp4" hue="blue" clipDur={2.5} /> },
  { key: "sinteticos_2", start: 603.85, dur: 10.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_lata_sintetico.mp4" hue="amber" clipDur={2.5} /> },
  { key: "sinteticos_3", start: 614.4, dur: 10.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/mr_pincel_barniz.mp4" hue="red" clipDur={2.5} /> },
  { key: "coment_0", start: 624.95, dur: 8.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/mr_tomas_camara.png" hue="blue" kicker="¿Qué madera vas a salvar?" /> },
  { key: "coment_1", start: 633.73, dur: 5.85, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Contame"},{"t":"qué"},{"t":"madera"},{"t":"salvaste","hl":true}]} eyebrow="Leo todos los comentarios" hue="amber" bg="grid" /> },
  { key: "cta2_0", start: 639.58, dur: 20.64, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/cta2_0.mp4" pages={[{"image":"img/dg_mr_manual2.png","eyebrow":"La tabla de madera + otros 39 arreglos de $1"}]} /> },
  { key: "cta2_1", start: 660.22, dur: 8.6, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="vid/mr_tres_frascos_mesa.mp4" title="40 arreglos de $1 a $5" chips={["Termitas","Óxido","Moho","Goteras"]} hue="amber" /> },
  { key: "cta2_2", start: 668.82, dur: 10.75, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Por separado","value":158,"tone":"danger"},{"label":"Hoy, lanzamiento","value":27,"winner":true}]} title="El valor" unit="US$" hue="blue" /> },
  { key: "cta2_3", start: 679.57, dur: 9.03, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="vid/mr_manual_celular.mp4" words={parseQuote("Con arreglar una gotera, *ya lo pagaste*.")} accent="good" hue="amber" /> },
  { key: "cierre_0", start: 688.6, dur: 2.7, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/mr_j_nueva.png" words={parseQuote("La independencia no se compra. Se *prepara con las manos*.")} hue="red" /> },
  { key: "cierre_1", start: 691.3, dur: 2.56, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Cuidá"},{"t":"tu"},{"t":"madera","hl":true}]} eyebrow="La independencia se prepara con las manos" hue="blue" bg="image" image="vid/mr_madera_dorada.mp4" /> },
  { key: "cierre_2", start: 693.86, dur: 6.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/mr_tomas_firma.png" hue="amber" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":37.28,"role":"popUp","vol":0.32},{"at":68.37,"role":"popUp","vol":0.32},{"at":75.53,"role":"popUp","vol":0.32},{"at":84.3,"role":"popUp","vol":0.32},{"at":101.15,"role":"popUp","vol":0.32},{"at":108.33,"role":"popUp","vol":0.32},{"at":111.52,"role":"popUp","vol":0.32},{"at":127.9,"role":"popUp","vol":0.32},{"at":136.6,"role":"popUp","vol":0.32},{"at":142.38,"role":"popUp","vol":0.32},{"at":144.6,"role":"popUp","vol":0.32},{"at":147,"role":"popUp","vol":0.32},{"at":161.35,"role":"popUp","vol":0.32},{"at":167.42,"role":"popUp","vol":0.32},{"at":200.99,"role":"popUp","vol":0.32},{"at":206,"role":"popUp","vol":0.32},{"at":209.46,"role":"popUp","vol":0.32},{"at":221.73,"role":"popUp","vol":0.32},{"at":259.62,"role":"popUp","vol":0.32},{"at":282.45,"role":"popUp","vol":0.32},{"at":288.3,"role":"popUp","vol":0.32},{"at":295.73,"role":"popUp","vol":0.32},{"at":304.23,"role":"popUp","vol":0.32},{"at":328.96,"role":"popUp","vol":0.32},{"at":347.32,"role":"popUp","vol":0.32},{"at":360.73,"role":"popUp","vol":0.32},{"at":364.32,"role":"popUp","vol":0.32},{"at":383.94,"role":"popUp","vol":0.32},{"at":391.02,"role":"popUp","vol":0.32},{"at":398.1,"role":"popUp","vol":0.32},{"at":412.18,"role":"popUp","vol":0.32},{"at":452.2,"role":"popUp","vol":0.32},{"at":456.42,"role":"popUp","vol":0.32},{"at":473.2,"role":"popUp","vol":0.32},{"at":496.08,"role":"popUp","vol":0.32},{"at":500.86,"role":"popUp","vol":0.32},{"at":517.47,"role":"popUp","vol":0.32},{"at":533.36,"role":"popUp","vol":0.32},{"at":548.39,"role":"popUp","vol":0.32},{"at":556.87,"role":"popUp","vol":0.32},{"at":565.32,"role":"popUp","vol":0.32},{"at":570.64,"role":"popUp","vol":0.32},{"at":580.59,"role":"popUp","vol":0.32},{"at":583.49,"role":"popUp","vol":0.32},{"at":585.91,"role":"popUp","vol":0.32},{"at":633.73,"role":"popUp","vol":0.32},{"at":639.58,"role":"popUp","vol":0.32},{"at":660.22,"role":"popUp","vol":0.32},{"at":668.82,"role":"popUp","vol":0.32},{"at":679.57,"role":"popUp","vol":0.32},{"at":688.6,"role":"popUp","vol":0.32},{"at":691.3,"role":"popUp","vol":0.32}];
