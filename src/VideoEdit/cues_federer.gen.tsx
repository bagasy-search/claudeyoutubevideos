// cues_federer.gen.tsx — GENERADO por beatsheet.mjs desde federer.json.
// NO editar a mano: cambiá el beatsheet y re-corré  node beatsheet.mjs beatsheet/federer.json
import { ReactNode } from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { ChipsCluster } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { BlurExplainer } from "./scenes/BlurExplainer";
import { IngredientEquation } from "./scenes/IngredientEquation";
import { DiagramBoard } from "./scenes/DiagramBoard";
import { StatBig } from "./scenes/StatBig";
import { NameTag } from "./scenes/NameTag";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { AnnotatedImage } from "./scenes/AnnotatedImage";

const G = COLORS.good;

export type Cue = { key: string; start: number; dur: number; kind: string; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
  { key: "hook_1", start: 22.46, dur: 1.22, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_viejo_piel.mp4" kicker="80 años, piel firme" clipDur={13.04} /> },
  { key: "hook_2", start: 23.68, dur: 2.53, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_viejo_piernas.mp4" clipDur={12.23} /> },
  { key: "hook_3", start: 26.21, dur: 4.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_viejo_camina.mp4" kicker="Sin dolor de rodillas" clipDur={28.11} /> },
  { key: "ramita_0", start: 34.72, dur: 2.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_romero_cocina.mp4" clipDur={6.48} /> },
  { key: "ramita_1", start: 37.01, dur: 2.3, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_romero_asado.mp4" clipDur={7.28} /> },
  { key: "ramita_2", start: 39.31, dur: 2.29, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_romero_mano.mp4" clipDur={38.6} /> },
  { key: "subestimada_0", start: 41.6, dur: 5.45, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/federer_casual.png" title="La planta anti-edad más subestimada" chips={["Barata","En tu cocina","Casi nadie la usa bien"]} /> },
  { key: "subestimada_1", start: 47.05, dur: 7.44, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_romero_manojo.mp4" clipDur={13.44} /> },
  { key: "formacorrecta_0", start: 54.49, dur: 5.11, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_romero_mal.mp4" clipDur={13.52} /> },
  { key: "formacorrecta_1", start: 59.6, dur: 3.4, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"La"},{"t":"mayoría"},{"t":"lo"},{"t":"usa"},{"t":"mal","hl":true}]} eyebrow="La forma correcta" bg="image" image="img/fe_romero_manojo.png" /> },
  { key: "trucoteaser_0", start: 63, dur: 10.28, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/fe_romero_cocina.png" title="Hoy: el truco exacto" chips={["Por qué funciona","El paso a paso","Cómo usarlo"]} /> },
  { key: "facultad_0", start: 73.28, dur: 4.07, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_lab_micro.mp4" clipDur={18.24} /> },
  { key: "facultad_1", start: 77.35, dur: 2.71, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Envejecer"},{"t":"no"},{"t":"es"},{"t":"solo"},{"t":"cumplir"},{"t":"años","hl":true}]} eyebrow="Lo que casi no se habla" bg="image" image="img/fe_lab_micro.png" /> },
  { key: "oxidacion_0", start: 80.06, dur: 4.82, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/oxidacion_0.mp4" pages={[{"image":"img/dg_fe_infl_ox.png","eyebrow":"Inflamación y oxidación"}]} /> },
  { key: "manzana_0", start: 84.88, dur: 8.88, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="img/fe_manzana_bg.png" image="img/fe_celula_ox.png" eyebrow="Oxidación" title="Como una manzana cortada" body="Tus células se oxidan cada día. Más óxido = más arrugas, venas y dolor." side="right" /> },
  { key: "manzana_1", start: 93.76, dur: 4.76, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_manzana_time.mp4" clipDur={13.47} /> },
  { key: "antioxidante_0", start: 98.52, dur: 4.26, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="img/antiox.png" kicker="Antioxidante potente" /> },
  { key: "antioxidante_1", start: 102.78, dur: 2.17, kind: "annotated", el: (d) => <AnnotatedImage durationInFrames={d} image="img/antiox.png" annotations={[{"kind":"circle","x":50,"y":50,"label":"Ácido carnósico + rosmarínico"}]} eyebrow="El antioxidante" caption="Frena el óxido interno de tus células" /> },
  { key: "compuestos_0", start: 104.95, dur: 10.17, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/compuestos_0.mp4" pages={[{"image":"img/dg_fe_escudos.png","eyebrow":"Frenan la oxidación que te envejece"}]} /> },
  { key: "compuestos_1", start: 115.12, dur: 6.36, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="vid/fe_escudo_clip.mp4" /> },
  { key: "tresc_0", start: 121.48, dur: 9.52, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/fe_romero_manojo.png" title="El romero toca 3 cosas" chips={["Arrugas","Várices","Dolores"]} /> },
  { key: "arrugas_0", start: 131, dur: 5.45, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="01" title="Las arrugas" /> },
  { key: "arrugas_1", start: 136.45, dur: 2.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_arrugas_cara.mp4" clipDur={12.5} /> },
  { key: "arrugas_mec_0", start: 139, dur: 9.13, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/arrugas_mec_0.mp4" pages={[{"image":"img/dg_fe_piel.png","eyebrow":"Más circulación = piel más firme"}]} /> },
  { key: "arrugas_mec_1", start: 148.13, dur: 10.65, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="img/fe_piel_bg.png" image="img/fe_gota_aceite.png" eyebrow="Arrugas" title="Riega la piel por dentro" body="Más sangre = más oxígeno. Como regar una planta que iba a secarse." side="left" /> },
  { key: "arrugas_const_0", start: 158.78, dur: 4.82, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={4} suffix=" semanas" label="de constancia para verte distinto al espejo" eyebrow="No es magia de un día" /> },
  { key: "arrugas_const_1", start: 163.6, dur: 7.23, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_espejo.mp4" clipDur={9.4} /> },
  { key: "arrugas_const_2", start: 170.83, dur: 5.41, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/fe_paciente_desc.png" words={parseQuote("Doctor, no sé qué es, pero me veo *descansado*.")} /> },
  { key: "varices_0", start: 176.24, dur: 5.84, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="02" title="Las várices" /> },
  { key: "varices_1", start: 182.08, dur: 2.74, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_varices.mp4" clipDur={14} /> },
  { key: "varices_porque_0", start: 184.82, dur: 9.5, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/varices_porque_0.mp4" pages={[{"image":"img/dg_fe_vena.png","eyebrow":"La sangre lucha contra la gravedad"}]} /> },
  { key: "varices_porque_1", start: 194.32, dur: 11.08, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="img/fe_pierna_bg.png" image="img/fe_vena_flujo.png" eyebrow="Várices" title="Vuelve a mover la sangre" body="Tonifica las paredes y reactiva la circulación estancada." side="right" /> },
  { key: "varices_masaje_0", start: 205.4, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_masaje_pierna.mp4" kicker="De abajo hacia el corazón" clipDur={20.52} /> },
  { key: "varices_masaje_1", start: 210.08, dur: 3.44, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="El masaje correcto" items={["Aceite de romero","De abajo hacia arriba","Siempre hacia el corazón"]} accent={G} /> },
  { key: "varices_masaje_2", start: 213.52, dur: 4.68, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_piernas_ligeras.mp4" clipDur={10.2} /> },
  { key: "dolores_0", start: 218.2, dur: 3.84, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="03" title="Los dolores" /> },
  { key: "dolores_1", start: 222.04, dur: 1.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_rodilla_dolor.mp4" clipDur={9.7} /> },
  { key: "dolores_2", start: 223.56, dur: 1.52, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_manos_rigidas.mp4" clipDur={10.6} /> },
  { key: "dolores_infl_0", start: 225.08, dur: 4.2, kind: "diagram", el: (d) => <DiagramBoard durationInFrames={d} clip="avatar_clips/dolores_infl_0.mp4" pages={[{"image":"img/dg_fe_articulacion.png","eyebrow":"Inflamación → el romero la baja"}]} /> },
  { key: "dolores_infl_1", start: 229.28, dur: 15.15, kind: "blurexplainer", el: (d) => <BlurExplainer durationInFrames={d} clip="img/fe_rodilla_bg.png" image="img/fe_articulacion_ins.png" eyebrow="Dolores" title="Antiinflamatorio natural" body="Relaja el músculo y baja la hinchazón, sin las pastillas de siempre." side="left" /> },
  { key: "resumen3_0", start: 244.43, dur: 9.01, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/fe_romero_manojo.png" title="Una sola planta" chips={["La piel","Las piernas","El dolor"]} /> },
  { key: "abuelos_0", start: 253.44, dur: 3.2, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_abuela_romero.mp4" clipDur={7.12} /> },
  { key: "abuelos_1", start: 256.64, dur: 2.14, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Ellos"},{"t":"no"},{"t":"leían"},{"t":"estudios."},{"t":"Pero"},{"t":"sabían","hl":true}]} eyebrow="Los abuelos" bg="image" image="img/fe_abuela_romero.png" /> },
  { key: "truco_0", start: 258.78, dur: 3.85, kind: "rule", el: (d) => <RuleNumberScene durationInFrames={d} number="★" title="El truco: aceite de romero" /> },
  { key: "truco_1", start: 262.63, dur: 5.77, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_aceite_frasco.mp4" clipDur={31.28} /> },
  { key: "ingredientes_0", start: 268.4, dur: 16.68, kind: "ingredients", el: (d) => <IngredientEquation durationInFrames={d} items={[{"name":"Romero","amount":"fresco o seco","image":"img/romero.png"},{"name":"Aceite","amount":"oliva o almendras","image":"img/fe_aceite_oliva.png"}]} /> },
  { key: "paso1_0", start: 285.08, dur: 7.09, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"4-5 ramas de romero","desc":"un puñado generoso","image":"img/fe_p1_ramas.png"},{"title":"Frasco de vidrio","desc":"limpio y MUY seco","image":"img/fe_p1_frasco.png"}]} eyebrow="Bien seco" title="Paso 1 · El frasco" /> },
  { key: "paso1_1", start: 292.17, dur: 7.09, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_p1_meter.mp4" clipDur={14.76} /> },
  { key: "paso2_0", start: 299.26, dur: 6.24, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_p2_aceite.mp4" kicker="Cubrir por completo" clipDur={11.16} /> },
  { key: "paciencia_0", start: 305.5, dur: 4.62, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"El"},{"t":"secreto:"},{"t":"la"},{"t":"paciencia","hl":true}]} eyebrow="Casi nadie lo respeta" bg="image" image="img/fe_aceite_frasco.png" /> },
  { key: "reposar_0", start: 310.12, dur: 5.92, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={15} suffix=" días" label="reposando en un lugar oscuro: así se carga el aceite" eyebrow="10 a 15 días" /> },
  { key: "reposar_1", start: 316.04, dur: 8.88, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_frasco_oscuro.mp4" clipDur={14.13} /> },
  { key: "atajo_0", start: 324.92, dur: 5.12, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="El atajo (mismo día)" items={[{"text":"Aceite + romero a fuego muy bajo","state":"done"},{"text":"Al baño maría, media hora","state":"done"},{"text":"SIN que hierva nunca","state":"warn"}]} /> },
  { key: "atajo_1", start: 330.04, dur: 6.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_bano_maria.mp4" kicker="Nunca que hierva" clipDur={6.5} /> },
  { key: "atajo_2", start: 336.9, dur: 6.86, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_colar.mp4" clipDur={11.36} /> },
  { key: "comousar_0", start: 343.76, dur: 19.29, kind: "process", el: (d) => <ProcessSteps durationInFrames={d} steps={[{"title":"Cara","desc":"unas gotas de noche, en círculos","image":"img/fe_uso_cara.png"},{"title":"Piernas y dolores","desc":"masaje lento con más aceite","image":"img/fe_uso_pierna.png"}]} eyebrow="Constancia" title="Cómo usarlo" /> },
  { key: "repeticion_0", start: 363.05, dur: 2.59, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"No"},{"t":"es"},{"t":"la"},{"t":"cantidad."},{"t":"Es"},{"t":"la"},{"t":"repetición","hl":true}]} eyebrow="El verdadero secreto" bg="image" image="img/fe_aceite_frasco.png" /> },
  { key: "advertencia_0", start: 365.64, dur: 8.57, kind: "checklist", el: (d) => <Checklist durationInFrames={d} title="Úsalo con cabeza" items={[{"text":"Embarazo o presión alta: consultá","state":"warn"},{"text":"Si tomás medicación fuerte: consultá","state":"warn"},{"text":"Probá primero un poco en el brazo","state":"done"}]} /> },
  { key: "advertencia_1", start: 374.21, dur: 10.71, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_prueba_brazo.mp4" clipDur={8.68} /> },
  { key: "aliado_0", start: 384.92, dur: 8.96, kind: "quote", el: (d) => <KineticQuote durationInFrames={d} image="img/fe_medico_calido.png" words={parseQuote("El romero es un *aliado*, no un milagro.")} /> },
  { key: "base_0", start: 393.88, dur: 11.44, kind: "splitlist", el: (d) => <SplitList durationInFrames={d} title="El romero potencia, tú pones la base" items={["Dormir bien","Tomar agua","Moverte cada día"]} accent={G} /> },
  { key: "imagina_0", start: 405.32, dur: 4.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_espejo_firme.mp4" clipDur={11.64} /> },
  { key: "imagina_1", start: 409.88, dur: 4.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_escaleras.mp4" clipDur={12.84} /> },
  { key: "imagina_2", start: 414.44, dur: 4.56, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_zapatos.mp4" clipDur={11.92} /> },
  { key: "ochenta_0", start: 419, dur: 7.28, kind: "stat", el: (d) => <StatBig durationInFrames={d} value={40} prefix="Aparentar " suffix=" años" label="teniendo 80: por saber lo que casi nadie sabe" eyebrow="El resultado" /> },
  { key: "info_0", start: 426.28, dur: 11.96, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"Envejecer"},{"t":"vs."},{"t":"envejecer"},{"t":"bien","hl":true}]} eyebrow="La diferencia es la información" bg="image" image="img/fe_romero_cocina.png" /> },
  { key: "favor_0", start: 438.24, dur: 4.81, kind: "chips", el: (d) => <ChipsCluster durationInFrames={d} bg="image" image="img/fe_aceite_frasco.png" title="Hoy, no mañana" chips={["Conseguí tu romero","Armá tu frasco","Empezá hoy"]} /> },
  { key: "favor_1", start: 443.05, dur: 6.55, kind: "raw", el: (d) => <RawShot durationInFrames={d} src="broll/fe_manos_frasco.mp4" clipDur={9.12} /> },
  { key: "cta_0", start: 449.6, dur: 15.08, kind: "nametag", el: (d) => <NameTag durationInFrames={d} name="Dr. Federer" /> },
  { key: "coment_0", start: 464.68, dur: 6.4, kind: "headline", el: (d) => <KineticHeadline durationInFrames={d} tokens={[{"t":"¿Ya"},{"t":"lo"},{"t":"usabas…"},{"t":"o"},{"t":"recién"},{"t":"te"},{"t":"enteras","hl":true},{"t":"?"}]} eyebrow="Contame en los comentarios" bg="image" image="img/fe_romero_manojo.png" /> },
];

export const REFRAME: { start: number; end: number }[] = [];

export const OVERLAYS: Cue[] = [

];

// cama de música (AudioBed) — null si el beatsheet no define "music"
export const AUDIO_BED: { src: string; activity: [number, number][]; base: number; duck: number; totalSec: number; loop: boolean } | null = null;

// riel de SFX suaves (SfxRail) — [] si "sfx": false
export const SFX_CUES: { at: number; role: string; vol?: number }[] = [{"at":41.6,"role":"popUp","vol":0.32},{"at":59.6,"role":"popUp","vol":0.32},{"at":63,"role":"popUp","vol":0.32},{"at":77.35,"role":"popUp","vol":0.32},{"at":80.06,"role":"popUp","vol":0.32},{"at":84.88,"role":"popUp","vol":0.32},{"at":102.78,"role":"popUp","vol":0.32},{"at":104.95,"role":"popUp","vol":0.32},{"at":121.48,"role":"popUp","vol":0.32},{"at":131,"role":"popUp","vol":0.32},{"at":139,"role":"popUp","vol":0.32},{"at":148.13,"role":"popUp","vol":0.32},{"at":158.78,"role":"popUp","vol":0.32},{"at":170.83,"role":"popUp","vol":0.32},{"at":176.24,"role":"popUp","vol":0.32},{"at":184.82,"role":"popUp","vol":0.32},{"at":194.32,"role":"popUp","vol":0.32},{"at":210.08,"role":"popUp","vol":0.32},{"at":218.2,"role":"popUp","vol":0.32},{"at":225.08,"role":"popUp","vol":0.32},{"at":229.28,"role":"popUp","vol":0.32},{"at":244.43,"role":"popUp","vol":0.32},{"at":256.64,"role":"popUp","vol":0.32},{"at":258.78,"role":"popUp","vol":0.32},{"at":268.4,"role":"popUp","vol":0.32},{"at":285.08,"role":"popUp","vol":0.32},{"at":305.5,"role":"popUp","vol":0.32},{"at":310.12,"role":"popUp","vol":0.32},{"at":324.92,"role":"popUp","vol":0.32},{"at":343.76,"role":"popUp","vol":0.32},{"at":363.05,"role":"popUp","vol":0.32},{"at":365.64,"role":"popUp","vol":0.32},{"at":384.92,"role":"popUp","vol":0.32},{"at":393.88,"role":"popUp","vol":0.32},{"at":419,"role":"popUp","vol":0.32},{"at":426.28,"role":"popUp","vol":0.32},{"at":438.24,"role":"popUp","vol":0.32},{"at":449.6,"role":"popUp","vol":0.32},{"at":464.68,"role":"popUp","vol":0.32}];
