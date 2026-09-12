// cues_salitre2.gen.tsx — GENERADO por beatsheet.mjs desde salitre2.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/salitre2.json
import { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ScrollDoc } from "./scenes/ScrollDoc";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { BarCompare } from "./scenes/BarCompare";
import { Checklist } from "./scenes/Checklist";
import { CalloutMark } from "./scenes/CalloutMark";

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 2.19, dur: 1.94, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_rascaste.png" hue="red" /> },
  { key: "hook_2", start: 4.13, dur: 5.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_pintaste.png" hue="amber" /> },
  { key: "hook_3", start: 9.24, dur: 15.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_volvio.png" hue="blue" /> },
  { key: "hook_4", start: 24.88, dur: 3.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_sintoma.png" hue="red" /> },
  { key: "hook_5", start: 28.17, dur: 11.49, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_aspirina_hook.png" hue="amber" /> },
  { key: "hook_6", start: 39.66, dur: 3.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_cartel.mp4" hue="blue" clipDur={5} /> },
  { key: "hook_7", start: 43.54, dur: 40.62, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"error"},{"t":"que"},{"t":"nadie"},{"t":"te"},{"t":"dice","hl":true}]} eyebrow="El salitre vuelve por esto" hue="red" bg="image" image="img/sa_hook_super.png" /> },
  { key: "hook_8", start: 84.16, dur: 8.04, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_tomas_hook.png" hue="amber" kicker="La barrera de $2" /> },
  { key: "guia1_0", start: 92.2, dur: 24.22, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="+40" image="img/sa_manual1.png" caption="arreglos de la casa, en un solo lugar" accent="good" hue="red" /> },
  { key: "quees_0", start: 116.42, dur: 15.78, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_no_hongo.mp4" hue="amber" clipDur={5} /> },
  { key: "quees_1", start: 132.2, dur: 9.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_sales.mp4" hue="blue" clipDur={5} /> },
  { key: "quees_2", start: 142.04, dur: 41.16, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/quees_2.mp4" pages={[{"image":"img/dg_sa_proceso.png","eyebrow":"El agua se evapora, la sal se queda"}]} /> },
  { key: "quees_3", start: 183.2, dur: 9.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_empuja.png" hue="amber" /> },
  { key: "quees_4", start: 192.9, dur: 10.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_revoque_cae.mp4" hue="blue" clipDur={5} /> },
  { key: "quees_5", start: 203.71, dur: 10.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_ladrillo_polvo.png" hue="red" /> },
  { key: "quees_6", start: 214.52, dur: 17.44, kind: "avpizarra", el: (d) => <AvatarPizarra durationInFrames={d} clip="avatar_clips/quees_6.mp4" items={[{"png":"img/sa_cut_gota.png","title":"Si hay salitre, hay HUMEDAD","body":"el salitre es la punta del iceberg"}]} side="right" eyebrow="La regla de oro" /> },
  { key: "ignorar_0", start: 231.96, dur: 24.83, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_estructura.mp4" hue="blue" clipDur={5} /> },
  { key: "ignorar_1", start: 256.79, dur: 11.35, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_moho_salud.png" hue="red" /> },
  { key: "ignorar_2", start: 268.14, dur: 14.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_valor_casa.mp4" hue="amber" clipDur={5} /> },
  { key: "aspirina_0", start: 282.44, dur: 24.1, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_acido.png" hue="red" /> },
  { key: "aspirina_1", start: 306.54, dur: 11.75, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_vapores.mp4" hue="amber" clipDur={5} /> },
  { key: "aspirina_2", start: 318.29, dur: 10.92, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Seguridad con el ácido" items={[{"text":"Guantes de goma y antiparras","state":"done"},{"text":"Barbijo + ventana abierta","state":"done"},{"text":"Cubrir el piso con nylon","state":"done"}]} hue="blue" /> },
  { key: "aspirina_3", start: 329.21, dur: 32.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_cepillo.png" hue="red" /> },
  { key: "aspirina_4", start: 361.43, dur: 11.46, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_dilucion.png" hue="amber" /> },
  { key: "aspirina_5", start: 372.89, dur: 14.61, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_agua_primero.mp4" hue="blue" clipDur={5} /> },
  { key: "aspirina_6", start: 387.5, dur: 8.99, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_efervescencia.png" hue="red" /> },
  { key: "aspirina_7", start: 396.49, dur: 10.79, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_diez_minutos.png" hue="amber" /> },
  { key: "aspirina_8", start: 407.28, dur: 17.98, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_enjuague.mp4" hue="blue" clipDur={5} /> },
  { key: "aspirina_9", start: 425.26, dur: 11.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_terminacion.png" hue="red" /> },
  { key: "aspirina_10", start: 437.03, dur: 11.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_revocar.mp4" hue="amber" clipDur={5} /> },
  { key: "aspirina_11", start: 448.8, dur: 25.91, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_ladrillo_visto.mp4" hue="blue" clipDur={5} /> },
  { key: "bridge_0", start: 474.71, dur: 30.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_tomas_bridge.png" hue="amber" /> },
  { key: "antibiotico_0", start: 505.24, dur: 19.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_tomas_medico.png" hue="blue" kicker="3 humedades, 3 tratamientos" /> },
  { key: "filtracion_0", start: 525, dur: 16.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_cano_roto.mp4" hue="red" clipDur={5} /> },
  { key: "filtracion_1", start: 541.07, dur: 10.93, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_suda_gotitas.png" hue="amber" /> },
  { key: "filtracion_2", start: 552, dur: 14.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_marca_crece.mp4" hue="blue" clipDur={5} /> },
  { key: "filtracion_3", start: 566.36, dur: 10.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_plomero.png" hue="red" /> },
  { key: "lluvia_0", start: 577.2, dur: 12.84, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_pared_exterior.mp4" hue="amber" clipDur={5} /> },
  { key: "lluvia_1", start: 590.04, dur: 10.82, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_empeora_lluvia.mp4" hue="blue" clipDur={5} /> },
  { key: "lluvia_2", start: 600.86, dur: 4.96, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_impermeable_afuera.mp4" hue="red" clipDur={5} /> },
  { key: "lluvia_3", start: 605.82, dur: 31.7, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_latex_imper.png" hue="amber" /> },
  { key: "capilaridad_0", start: 637.52, dur: 35.2, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/capilaridad_0.mp4" pages={[{"image":"img/dg_sa_capilaridad.png","eyebrow":"El agua sube del suelo como el café por el azúcar"}]} /> },
  { key: "capilaridad_1", start: 672.72, dur: 10.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_cafe_terron.mp4" hue="red" clipDur={5} /> },
  { key: "capilaridad_2", start: 683.64, dur: 10.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_capa_rota.png" hue="amber" /> },
  { key: "capilaridad_3", start: 694.56, dur: 11.8, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_franja_abajo.mp4" hue="blue" clipDur={5} /> },
  { key: "capilaridad_4", start: 706.36, dur: 25.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_linea_sube.mp4" hue="red" clipDur={5} /> },
  { key: "inyeccion_0", start: 731.84, dur: 28.16, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_taladro_mecha.mp4" hue="red" clipDur={5} /> },
  { key: "inyeccion_1", start: 760, dur: 4.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_dos_tercios.png" hue="amber" /> },
  { key: "inyeccion_2", start: 764.48, dur: 4.48, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_perforaciones.mp4" hue="blue" clipDur={5.03} /> },
  { key: "inyeccion_3", start: 768.96, dur: 14.81, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_inyectar.png" hue="red" /> },
  { key: "inyeccion_4", start: 783.77, dur: 17.64, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_tres_dias.mp4" hue="amber" clipDur={5} /> },
  { key: "inyeccion_5", start: 801.41, dur: 18.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_cristaliza.png" hue="blue" /> },
  { key: "inyeccion_6", start: 819.61, dur: 21.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_pared_seca.mp4" hue="red" clipDur={5} /> },
  { key: "guia2_0", start: 841.32, dur: 27.64, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} figure="cm" image="img/sa_manual2.png" caption="cada cuánto perforar + dosis exactas" accent="good" hue="amber" /> },
  { key: "otros_0", start: 868.96, dur: 17.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_rehacer_capa.mp4" hue="blue" clipDur={5} /> },
  { key: "otros_1", start: 886.67, dur: 21.62, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_electroosmosis.png" hue="red" /> },
  { key: "plata_0", start: 908.29, dur: 52.23, kind: "bars", el: (d) => <BarCompare durationInFrames={d} bars={[{"label":"Empresa especialista","value":100,"tone":"danger"},{"label":"Inyección casera","value":5,"winner":true}]} title="Barrera anti-humedad" unit="US$" hue="red" /> },
  { key: "plata_1", start: 960.52, dur: 29.72, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_revoque_hidrofugo.mp4" hue="amber" clipDur={5} /> },
  { key: "esconden_0", start: 990.24, dur: 22.92, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_pintura_antihumedad.png" hue="amber" /> },
  { key: "esconden_1", start: 1013.16, dur: 31.72, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Te"},{"t":"venden"},{"t":"la"},{"t":"aspirina","hl":true}]} eyebrow="El antibiótico te lo esconden" hue="blue" bg="image" image="img/sa_cliente.png" /> },
  { key: "esconden_2", start: 1044.88, dur: 3.85, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_capa_vieja.mp4" hue="red" clipDur={5} /> },
  { key: "esconden_3", start: 1048.73, dur: 40.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_brea.mp4" hue="amber" clipDur={5} /> },
  { key: "faq_0", start: 1089.09, dur: 4.47, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_tomas_faq.png" hue="blue" kicker="Las dudas de siempre" /> },
  { key: "faq_1", start: 1093.56, dur: 151.04, kind: "scrolldoc", el: (d) => <ScrollDoc durationInFrames={d} panels={[{"eyebrow":"Diagnóstico","heading":"¿Cuál de las 3?","body":"cómo sé cuál de las tres humedades tengo. La regla","poster":"img/sa_q_cual.png"},{"eyebrow":"Orden","heading":"¿Pinto encima?","body":"Primero sacas el salitre con la aspirina y cortas la humedad","poster":"img/sa_q_pintar.png"},{"eyebrow":"El ácido","heading":"¿Daña la pared?","body":"cortar la humedad? Paciencia con","poster":"img/sa_q_acido.png"},{"eyebrow":"Paciencia","heading":"¿Cuánto tarda en secar?","body":"depende de donde vivas. Si es capilaridad en una","poster":"img/sa_q_seca.png"}]} /> },
  { key: "cta_0", start: 1244.6, dur: 45, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/sa_manual3.png" words={parseQuote("Con NO llamar a un especialista, *ya lo pagaste*.")} accent="good" hue="red" /> },
  { key: "cierre_0", start: 1289.6, dur: 56.4, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/sa_aliado.mp4" hue="amber" clipDur={5} /> },
  { key: "cierre_1", start: 1346, dur: 7.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_encontra_agua.png" hue="blue" /> },
  { key: "cierre_2", start: 1353.3, dur: 7.31, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/sa_tomas_cierre.png" hue="red" kicker="El próximo: el moho y la condensación" /> },
  { key: "cierre_3", start: 1360.61, dur: 4.81, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Curá"},{"t":"la"},{"t":"pared"},{"t":"de"},{"t":"verdad","hl":true}]} eyebrow="Aspirina para hoy, antibiótico para siempre" hue="amber" bg="image" image="img/sa_cierre.png" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":43.54,"role":"popUp","vol":0.32},{"at":92.2,"role":"popUp","vol":0.32},{"at":142.04,"role":"popUp","vol":0.32},{"at":214.52,"role":"popUp","vol":0.32},{"at":318.29,"role":"popUp","vol":0.32},{"at":637.52,"role":"popUp","vol":0.32},{"at":841.32,"role":"popUp","vol":0.32},{"at":908.29,"role":"popUp","vol":0.32},{"at":1013.16,"role":"popUp","vol":0.32},{"at":1093.56,"role":"popUp","vol":0.32},{"at":1244.6,"role":"popUp","vol":0.32},{"at":1360.61,"role":"popUp","vol":0.32}];
