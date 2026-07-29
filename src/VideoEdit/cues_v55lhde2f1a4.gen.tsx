import type { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { OptionCompare } from "./scenes/OptionCompare";
import { SplitList } from "./scenes/SplitList";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { CrossSection } from "./scenes/CrossSection";
import { BarCompare } from "./scenes/BarCompare";
import { StatBig } from "./scenes/StatBig";
import { CalloutMark } from "./scenes/CalloutMark";

export type V55Cue = { key:string; start:number; dur:number; kind:string; el:(durationInFrames:number)=>ReactNode };
export const CUES_V55LHDE2F1A4: V55Cue[] = [
  { key:"s_02", start:8.56, dur:6.86, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"AYER"},{t:"SOLO"},{t:"HABÍA"},{t:"MADERA",hl:true}]} /> },
  { key:"s_04", start:19, dur:5.6, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u003.mp4" hue="amber" clipDur={16} kbPhase={1} /> },
  { key:"s_05", start:24.6, dur:4.98, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("entre 12 y 24")} /> },
  { key:"s_06", start:29.58, dur:7.78, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u009.mp4" hue="amber" clipDur={14} kbPhase={3} /> },
  { key:"s_07", start:37.36, dur:4.48, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u011.mp4" hue="amber" clipDur={20} kbPhase={0} /> },
  { key:"s_08", start:41.84, dur:6.02, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Y.","si llenas"]} /> },
  { key:"s_11", start:59.7, dur:5.04, kind:"processsteps", el:(d) => <ProcessSteps durationInFrames={d} title="MÉTODO" hue="amber" steps={[{title:"antes"},{title:"de"},{title:"que toquen"}]} /> },
  { key:"s_12", start:64.74, dur:3.32, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u001.mp4" hue="amber" clipDur={30} kbPhase={3} /> },
  { key:"s_15", start:81.44, dur:6.3, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"No es",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"magia amish",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_17", start:94.08, dur:6.02, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u006.mp4" hue="amber" clipDur={12} kbPhase={1} /> },
  { key:"s_18", start:100.1, dur:4.76, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Durante","generaciones"]} accent="tan" /> },
  { key:"s_19", start:104.86, dur:6.22, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Si",state:"done"},{text:"el",state:"done"},{text:"sauce",state:"done"}]} /> },
  { key:"s_20", start:111.08, dur:5.08, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="La" hue="amber" /> },
  { key:"s_21", start:116.16, dur:7.96, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u015.mp4" hue="amber" clipDur={57} kbPhase={1} /> },
  { key:"s_24", start:139.76, dur:4.82, kind:"crosssection", el:(d) => <CrossSection durationInFrames={d} eyebrow="CORTE" title="Eso importa" hue="amber" layers={[{label:"Tallo",color:"brown"},{label:"Callo",color:"tan"},{label:"Raíces",color:"green"}]} marker={{label:"nodo",atDepth:58,color:"good"}} /> },
  { key:"s_25", start:144.58, dur:5.54, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="El agua" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_27", start:155.42, dur:3.48, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} suffix=" h" eyebrow="NÚMERO" label="Ahora sí" hue="amber" /> },
  { key:"s_28", start:158.9, dur:4.4, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u048.mp4" hue="amber" clipDur={9} kbPhase={1} /> },
  { key:"s_29", start:163.3, dur:3.84, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="No cortes" hue="amber" /> },
  { key:"s_31", start:174.14, dur:3.92, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"LAS"},{t:"PUNTAS"},{t:"ACTIVAS"},{t:"SON",hl:true}]} /> },
  { key:"s_32", start:178.06, dur:3.66, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u037.mp4" hue="amber" clipDur={10} kbPhase={0} /> },
  { key:"s_33", start:181.72, dur:3.22, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Corta las ramitas en")} /> },
  { key:"s_35", start:189.56, dur:5.9, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Pon los","trozos en"]} /> },
  { key:"s_36", start:195.46, dur:4.48, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"ES"},{t:"CASI"},{t:"UN"},{t:"GALÓN",hl:true}]} /> },
  { key:"s_39", start:206.94, dur:4.22, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Tapa",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"el recipiente",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_40", start:211.16, dur:4.14, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Cuando","esté","frío"]} accent="tan" /> },
  { key:"s_41", start:215.3, dur:3.38, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"A.",state:"done"},{text:"veces",state:"done"},{text:"toma",state:"done"}]} /> },
  { key:"s_43", start:222.52, dur:4.72, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="07" label="REGLA" title="Es" hue="amber" /> },
  { key:"s_45", start:231, dur:5.6, kind:"crosssection", el:(d) => <CrossSection durationInFrames={d} eyebrow="CORTE" title="Haz poca" hue="amber" layers={[{label:"Tallo",color:"brown"},{label:"Callo",color:"tan"},{label:"Raíces",color:"green"}]} marker={{label:"nodo",atDepth:58,color:"good"}} /> },
  { key:"s_47", start:243.48, dur:6, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="Puedes usar" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_49", start:257.22, dur:3.7, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Pero siempre deja" hue="amber" /> },
  { key:"s_50", start:260.92, dur:2.9, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Las futuras" hue="amber" /> },
  { key:"s_51", start:263.82, dur:5.02, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"LA"},{t:"INDUSTRIA"},{t:"SUELE"},{t:"VENDER",hl:true}]} /> },
  { key:"s_52", start:268.84, dur:4.64, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u049.mp4" hue="amber" clipDur={18} kbPhase={1} /> },
  { key:"s_53", start:273.48, dur:4.18, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Fungicida número 4")} /> },
  { key:"s_56", start:284.98, dur:4.18, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Da","oxígeno a"]} /> },
  { key:"s_57", start:289.16, dur:3.52, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"LA"},{t:"BIOLOGÍA"},{t:"VIENE"},{t:"PRIMERO",hl:true}]} /> },
  { key:"s_59", start:298.56, dur:6.64, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Empieza con",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"una especie",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_60", start:305.2, dur:4, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Algunas","plantas","de"]} accent="tan" /> },
  { key:"s_61", start:309.2, dur:5.84, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u046.mp4" hue="amber" clipDur={21} kbPhase={3} /> },
  { key:"s_62", start:315.04, dur:3, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Y.",state:"done"},{text:"algunas",state:"done"},{text:"leñosas",state:"done"}]} /> },
  { key:"s_63", start:318.04, dur:5.86, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="07" label="REGLA" title="Por" hue="amber" /> },
  { key:"s_64", start:323.9, dur:3.04, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u034.mp4" hue="amber" clipDur={11} kbPhase={2} /> },
  { key:"s_65", start:326.94, dur:7.06, kind:"crosssection", el:(d) => <CrossSection durationInFrames={d} eyebrow="CORTE" title="Si alguien" hue="amber" layers={[{label:"Tallo",color:"brown"},{label:"Callo",color:"tan"},{label:"Raíces",color:"green"}]} marker={{label:"nodo",atDepth:58,color:"good"}} /> },
  { key:"s_67", start:338.38, dur:5.22, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="Debe tener" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_68", start:343.6, dur:6.44, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} suffix=" días" eyebrow="NÚMERO" label="Allí hay tejido" hue="amber" /> },
  { key:"s_71", start:357.98, dur:3.66, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Un corte" hue="amber" /> },
  { key:"s_72", start:361.64, dur:4.24, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"Y."},{t:"ABRE"},{t:"UNA"},{t:"PUERTA",hl:true}]} /> },
  { key:"s_73", start:365.88, dur:5.74, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Deja una o dos")} /> },
  { key:"s_75", start:374.64, dur:3.18, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u065.mp4" hue="amber" clipDur={30} kbPhase={1} /> },
  { key:"s_77", start:381.96, dur:2.7, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["En","un esqueje"]} /> },
  { key:"s_79", start:390.34, dur:3.58, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"AQUÍ"},{t:"HACEMOS"},{t:"LA"},{t:"DEMOSTRACIÓN",hl:true}]} /> },
  { key:"s_80", start:393.92, dur:3.64, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Prepara",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"dos frascos",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_81", start:397.56, dur:4.7, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["En","el","segundo pon"]} accent="tan" /> },
  { key:"s_83", start:405, dur:5.04, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Del",state:"done"},{text:"mismo",state:"done"},{text:"grosor",state:"done"}]} /> },
  { key:"s_84", start:410.04, dur:3.38, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="07" label="REGLA" title="Marca" hue="amber" /> },
  { key:"s_85", start:413.42, dur:3.06, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="No cambies" hue="amber" /> },
  { key:"s_86", start:416.48, dur:3.44, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"NO"},{t:"PONGAS"},{t:"UNO"},{t:"JUNTO",hl:true}]} /> },
  { key:"s_87", start:419.92, dur:4.76, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Si cambias cinco" hue="amber" /> },
  { key:"s_88", start:424.68, dur:3.8, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Tres o" hue="amber" /> },
  { key:"s_91", start:437.16, dur:4.7, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u071.mp4" hue="amber" clipDur={17} kbPhase={0} /> },
  { key:"s_92", start:441.86, dur:4.44, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"LAS"},{t:"BACTERIAS"},{t:"ENCUENTRAN"},{t:"ALIMENTO",hl:true}]} /> },
  { key:"s_93", start:446.3, dur:3.74, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Entonces agregan más tónico")} /> },
  { key:"s_96", start:458.8, dur:3.7, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Una ventana","muy caliente"]} /> },
  { key:"s_98", start:467.44, dur:3.32, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"BUSCA"},{t:"LUZ"},{t:"BRILLANTE",hl:true}]} /> },
  { key:"s_99", start:470.76, dur:3.3, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Cambia",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"el agua",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_100", start:474.06, dur:3.74, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u080.mp4" hue="amber" clipDur={10} kbPhase={2} /> },
  { key:"s_101", start:477.8, dur:4.38, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Y.","no","saques"]} accent="tan" /> },
  { key:"s_102", start:482.18, dur:5.02, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Durante",state:"done"},{text:"los",state:"done"},{text:"primeros",state:"done"}]} /> },
  { key:"s_105", start:494.6, dur:3.78, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="07" label="REGLA" title="En" hue="amber" /> },
  { key:"s_106", start:498.38, dur:3.66, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Después llegan" hue="amber" /> },
  { key:"s_108", start:506.6, dur:5.46, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="Mira también" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_109", start:512.06, dur:4.4, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Un esqueje verde" hue="amber" /> },
  { key:"s_110", start:516.46, dur:6, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Anota el" hue="amber" /> },
  { key:"s_111", start:522.46, dur:4.4, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"SI"},{t:"HACES"},{t:"TRES"},{t:"PARES",hl:true}]} /> },
  { key:"s_113", start:531.28, dur:2.94, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u035.mp4" hue="amber" clipDur={15} kbPhase={3} /> },
  { key:"s_114", start:534.22, dur:4.78, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Y para muchas especies")} /> },
  { key:"s_116", start:542.9, dur:4.22, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Por","ejemplo"]} /> },
  { key:"s_117", start:547.12, dur:3.16, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"NO"},{t:"LO"},{t:"CONVIERTAS",hl:true}]} /> },
  { key:"s_120", start:558.1, dur:3.18, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Coloca",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"al menos",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_121", start:561.28, dur:8.3, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Presiona","suavemente","el medio"]} accent="tan" /> },
  { key:"s_122", start:569.58, dur:6.5, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"La",state:"done"},{text:"bolsa",state:"done"},{text:"no",state:"done"}]} /> },
  { key:"s_123", start:576.08, dur:6.46, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="Abre" hue="amber" /> },
  { key:"s_124", start:582.54, dur:3.64, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Humedad no" hue="amber" /> },
  { key:"s_126", start:589.66, dur:3.32, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"SI"},{t:"OFRECE"},{t:"RESISTENCIA"},{t:"PUEDE",hl:true}]} /> },
  { key:"s_128", start:599.1, dur:6.04, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} suffix=" cm" eyebrow="NÚMERO" label="Cuando tenga dos" hue="amber" /> },
  { key:"s_129", start:605.14, dur:6.1, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="En plantas" hue="amber" /> },
  { key:"s_130", start:611.24, dur:3.84, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u030.mp4" hue="amber" clipDur={16} kbPhase={3} /> },
  { key:"s_132", start:617.98, dur:4.44, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"AL"},{t:"PASARLAS"},{t:"A."},{t:"SUSTRATO",hl:true}]} /> },
  { key:"s_133", start:622.42, dur:3.12, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Cuanto más esperas")} /> },
  { key:"s_134", start:625.54, dur:3.64, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Pond el","esqueje en"]} /> },
  { key:"s_135", start:629.18, dur:4.94, kind:"processsteps", el:(d) => <ProcessSteps durationInFrames={d} title="MÉTODO" hue="amber" steps={[{title:"Mantén"},{title:"la"},{title:"luz indirecta"}]} /> },
  { key:"s_136", start:634.12, dur:2.9, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Después",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"reduce la",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_137", start:637.02, dur:5.8, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u052.mp4" hue="amber" clipDur={12} kbPhase={1} /> },
  { key:"s_138", start:642.82, dur:3.38, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Perdería","en","una"]} accent="tan" /> },
  { key:"s_140", start:652.68, dur:5.74, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Las",state:"done"},{text:"especies",state:"done"},{text:"fáciles",state:"done"}]} /> },
  { key:"s_141", start:658.42, dur:6.2, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="Otras" hue="amber" /> },
  { key:"s_142", start:664.62, dur:3.84, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="menos capacidad" hue="amber" /> },
  { key:"s_143", start:668.46, dur:7.3, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="La edad" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_145", start:680.5, dur:4.36, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Otras se propagan" hue="amber" /> },
  { key:"s_147", start:689.32, dur:6.92, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Si cortas" hue="amber" /> },
  { key:"s_148", start:696.24, dur:7.56, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"PARECE"},{t:"UN"},{t:"DETALLE"},{t:"MENOR",hl:true}]} /> },
  { key:"s_149", start:703.8, dur:3.48, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u059.mp4" hue="amber" clipDur={58} kbPhase={2} /> },
  { key:"s_150", start:707.28, dur:3.06, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Observar la especie")} /> },
  { key:"s_151", start:710.34, dur:3.48, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Evitar","la flor"]} /> },
  { key:"s_154", start:726.2, dur:5.66, kind:"processsteps", el:(d) => <ProcessSteps durationInFrames={d} title="MÉTODO" hue="amber" steps={[{title:"La"},{title:"explicación"},{title:"popular suele"}]} /> },
  { key:"s_155", start:731.86, dur:6.36, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"El",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"ácido indolbutírico",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_157", start:741.98, dur:4.12, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Pero","aquí","hay"]} accent="tan" /> },
  { key:"s_158", start:746.1, dur:7.36, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u064.mp4" hue="amber" clipDur={8} kbPhase={0} /> },
  { key:"s_159", start:753.46, dur:5.62, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Una",state:"done"},{text:"especie",state:"done"},{text:"no",state:"done"}]} /> },
  { key:"s_160", start:759.08, dur:2.82, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="Por" hue="amber" /> },
  { key:"s_161", start:761.9, dur:3.06, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="No necesariamente" hue="amber" /> },
  { key:"s_162", start:764.96, dur:3.44, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"EXISTEN"},{t:"PORQUE"},{t:"UNA"},{t:"CONCENTRACIÓN",hl:true}]} /> },
  { key:"s_163", start:768.4, dur:3.94, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={10} eyebrow="NÚMERO" label="Un vivero que" hue="amber" /> },
  { key:"s_165", start:779.42, dur:3.82, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u005.mp4" hue="amber" clipDur={15} kbPhase={2} /> },
  { key:"s_166", start:783.24, dur:6, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Esa es" hue="amber" /> },
  { key:"s_169", start:801.32, dur:3.48, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"SI"},{t:"ESTOY"},{t:"PROPAGANDO",hl:true}]} /> },
  { key:"s_171", start:813.6, dur:5.62, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Lo barato debe ahorrar")} /> },
  { key:"s_172", start:819.22, dur:5.32, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Hay","otro mito"]} /> },
  { key:"s_173", start:824.54, dur:4.62, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"PUEDEN"},{t:"TENER"},{t:"PROPIEDADES",hl:true}]} /> },
  { key:"s_175", start:834.7, dur:3.56, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"porque",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"esa especie",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_177", start:846.2, dur:7.6, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u002.mp4" hue="amber" clipDur={43} kbPhase={1} /> },
  { key:"s_178", start:853.8, dur:5.42, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["No","mezcles","miel"]} accent="tan" /> },
  { key:"s_179", start:859.22, dur:4.16, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Eso",state:"done"},{text:"no",state:"done"},{text:"es",state:"done"}]} /> },
  { key:"s_181", start:867.26, dur:4.4, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="Ahí" hue="amber" /> },
  { key:"s_182", start:871.66, dur:3.52, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="No bebas" hue="amber" /> },
  { key:"s_184", start:878.3, dur:5, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="No propades" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_186", start:887.48, dur:5.48, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u067.mp4" hue="amber" clipDur={92} kbPhase={3} /> },
  { key:"s_187", start:892.96, dur:4.32, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Tener una planta" hue="amber" /> },
  { key:"s_189", start:900.68, dur:3.06, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="1" eyebrow="CLAVE" caption="Grupo 1" hue="amber" /> },
  { key:"s_190", start:903.74, dur:4.22, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"ALBACA",hl:true}]} /> },
  { key:"s_193", start:916.9, dur:6.22, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Grupo 2")} /> },
  { key:"s_194", start:923.12, dur:5.84, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Aquí","importa mucho"]} /> },
  { key:"s_196", start:935.02, dur:8.18, kind:"processsteps", el:(d) => <ProcessSteps durationInFrames={d} title="MÉTODO" hue="amber" steps={[{title:"Grupo"},{title:"3."}]} /> },
  { key:"s_197", start:943.2, dur:6, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Pero cada",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"especie tiene",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_198", start:949.2, dur:5.18, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Grupo","4."]} accent="tan" /> },
  { key:"s_200", start:960.54, dur:4.2, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Puedes",state:"done"},{text:"mantener",state:"done"},{text:"una",state:"done"}]} /> },
  { key:"s_201", start:964.74, dur:5.28, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u032.mp4" hue="amber" clipDur={16} kbPhase={1} /> },
  { key:"s_202", start:970.02, dur:4.02, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="06" label="REGLA" title="5." hue="amber" /> },
  { key:"s_204", start:979.74, dur:7.22, kind:"crosssection", el:(d) => <CrossSection durationInFrames={d} eyebrow="CORTE" title="Si cortas" hue="amber" layers={[{label:"Tallo",color:"brown"},{label:"Callo",color:"tan"},{label:"Raíces",color:"green"}]} marker={{label:"nodo",atDepth:58,color:"good"}} /> },
  { key:"s_205", start:986.96, dur:6.32, kind:"barcompare", el:(d) => <BarCompare durationInFrames={d} eyebrow="COMPARA" title="El tallo" hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} /> },
  { key:"s_208", start:1004.24, dur:3.34, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={7} eyebrow="NÚMERO" label="Toma los esquejes" hue="amber" /> },
  { key:"s_209", start:1007.58, dur:3.26, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Elige crecimiento" hue="amber" /> },
  { key:"s_210", start:1010.84, dur:6.36, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"TENE"},{t:"EL"},{t:"RECIPIENTE"},{t:"PREPARADO",hl:true}]} /> },
  { key:"s_212", start:1021.14, dur:3.2, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Esta parte vale más")} /> },
  { key:"s_214", start:1030.96, dur:3.58, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Y ahora","el segundo"]} /> },
  { key:"s_216", start:1039.06, dur:4.78, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u016.mp4" hue="amber" clipDur={7} kbPhase={2} /> },
  { key:"s_217", start:1043.84, dur:4.52, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"NO"},{t:"PLANTES"},{t:"EL"},{t:"ESQUEJE",hl:true}]} /> },
  { key:"s_218", start:1048.36, dur:3.58, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Espera",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"raíces verdaderas",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_221", start:1060.6, dur:3.62, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["Las","sales","concentradas"]} accent="tan" /> },
  { key:"s_223", start:1067.56, dur:6.24, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"Es",state:"done"},{text:"fabricar",state:"done"},{text:"raíces",state:"done"}]} /> },
  { key:"s_224", start:1073.8, dur:5.28, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="05" label="REGLA" title="paciencia" hue="amber" /> },
  { key:"s_225", start:1079.08, dur:3.6, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="Si quieres" hue="amber" /> },
  { key:"s_226", start:1082.68, dur:3.46, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"PRIMERO",hl:true}]} /> },
  { key:"s_227", start:1086.14, dur:3.86, kind:"statbig", el:(d) => <StatBig durationInFrames={d} value={8} suffix=" cm" eyebrow="NÚMERO" label="Retira las hojas" hue="amber" /> },
  { key:"s_230", start:1096.7, dur:5.14, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="2" eyebrow="CLAVE" caption="Cuela y" hue="amber" /> },
  { key:"s_231", start:1101.84, dur:3.76, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u040.mp4" hue="amber" clipDur={41} kbPhase={0} /> },
  { key:"s_233", start:1109.78, dur:3.22, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"MISMA"},{t:"PLANTA",hl:true}]} /> },
  { key:"s_234", start:1113, dur:4, kind:"kineticquote", el:(d) => <KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote("Quinto")} /> },
  { key:"s_235", start:1117, dur:4.08, kind:"textcardreveal", el:(d) => <TextCardReveal durationInFrames={d} lines={["Cambia el","líquido si"]} /> },
  { key:"s_237", start:1127.1, dur:3.2, kind:"clip", el:(d) => <RawShot durationInFrames={d} src="broll/v55lhde2f1a4/u038.mp4" hue="amber" clipDur={22} kbPhase={0} /> },
  { key:"s_238", start:1130.3, dur:3.84, kind:"kineticheadline", el:(d) => <KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[{t:"MANTÉN"},{t:"HUMEDAD"},{t:"AL"},{t:"PRINCIPIO",hl:true}]} /> },
  { key:"s_239", start:1134.14, dur:3.88, kind:"optioncompare", el:(d) => <OptionCompare durationInFrames={d} left={{tag:"evita",title:"Y.",sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:"recuerda las",sub:"agua",note:"sauce",icon:"check",accent:"green"}} /> },
  { key:"s_242", start:1148.74, dur:2.66, kind:"splitlist", el:(d) => <SplitList durationInFrames={d} title="PUNTOS CLAVE" items={["No","me","digas"]} accent="tan" /> },
  { key:"s_245", start:1162.42, dur:7.1, kind:"checklist", el:(d) => <Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[{text:"un",state:"done"},{text:"puñado",state:"done"},{text:"de",state:"done"}]} /> },
  { key:"s_246", start:1169.52, dur:5.64, kind:"rulenumberscene", el:(d) => <RuleNumberScene durationInFrames={d} number="05" label="REGLA" title="Es" hue="amber" /> },
  { key:"s_247", start:1175.16, dur:3.36, kind:"calloutmark", el:(d) => <CalloutMark durationInFrames={d} figure="OK" eyebrow="CLAVE" caption="La gente" hue="amber" /> },
];

// Manifiesto explícito: lo valida farm.mjs antes de encender runners.
export const ASSET_MANIFEST_V55LHDE2F1A4 = [
  {
    "src": "avatar_v55lhde2f1a4.mp4"
  },
  {
    "src": "assets/ic_warn.svg"
  },
  {
    "src": "assets/ic_check.svg"
  },
  {
    "src": "broll/v55lhde2f1a4/u003.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u009.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u011.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u001.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u006.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u015.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u048.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u037.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u049.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u046.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u034.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u065.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u071.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u080.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u035.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u030.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u052.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u059.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u064.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u005.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u002.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u067.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u032.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u016.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u040.mp4"
  },
  {
    "src": "broll/v55lhde2f1a4/u038.mp4"
  }
] as const;
