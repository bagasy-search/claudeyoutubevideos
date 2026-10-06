// GENERADO por build_clembudo.mjs. NO editar a mano.
import React from "react";
import { ClClip, ClPhoto } from "../clembudo/Piezas";
import { MovTresAguas } from "../clembudo/MovTresAguas";
import { MovCloroBorax } from "../clembudo/MovCloroBorax";
import { MovCuatroPasos } from "../clembudo/MovCuatroPasos";
import { MovDinero } from "../clembudo/MovDinero";
import { MovCaso35 } from "../clembudo/MovCaso35";
import { MovCierre } from "../clembudo/MovCierre";
import { FloatingInsert } from "./scenes/FloatingInsert";
import { BigStatReveal, PullQuote, MythTruth, HighlightSweep, ChecklistReveal, VsDuel, CtaCard } from "./kit/premium";
import { THEME_EARTH } from "./kit/premium/theme";

export const CUES: { key: string; start: number; dur: number; el: (d: number) => React.ReactNode }[] = [
  { key: "clip_3300", start: 3.3, dur: 2.83333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s002.mp4" startFrom={0} /> },
  { key: "foto_6120", start: 6.13333, dur: 2.03333, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s003.png" seed={6120} /> },
  { key: "clip_8180", start: 8.16667, dur: 3.46667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s004.mp4" startFrom={0} /> },
  { key: "componente_13360", start: 13.36667, dur: 5.46667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s002.png" seed={13360} /><BigStatReveal durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"UN TRABAJO","prefix":"$","value":300,"support":"Entre 80 y 300 dólares, en efectivo, el mismo día que lo terminas","source":""} as any)} /></> },
  { key: "foto_19760", start: 19.76667, dur: 4.6, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s008.png" seed={19760} /> },
  { key: "foto_24360", start: 24.36667, dur: 7.2, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s009.png" seed={24360} /> },
  { key: "foto_31580", start: 31.56667, dur: 5.26667, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s010.png" seed={31580} /> },
  { key: "componente_40520", start: 40.53333, dur: 5.66667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s012.png" seed={40520} /><PullQuote durationInFrames={d} theme={THEME_EARTH} {...({"quote":"Esto no lo aprendí en ningún curso. Lo aprendí peleándome con mi propia casa.","author":"Claudio Mendoza","role":"El Constructor Libre","image":"img/clembudo/clembudo_s012.png"} as any)} /></> },
  { key: "componente_51920", start: 51.93333, dur: 6.46667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s014.png" seed={51920} /><MythTruth durationInFrames={d} theme={THEME_EARTH} {...({"mythLabel":"LO QUE HICE TRES VECES","myth":"Taparla con cloro, sellador y pintura cara","truthLabel":"LO QUE LA RESOLVIÓ","truth":"Buscar de dónde venía el agua"} as any)} /></> },
  { key: "clip_61540", start: 61.53333, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s017.mp4" startFrom={0} /> },
  { key: "clip_68380", start: 68.36667, dur: 2.86667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s019.mp4" startFrom={0} /> },
  { key: "foto_74660", start: 74.66667, dur: 3.66667, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s020.png" seed={74660} /> },
  { key: "clip_78320", start: 78.33333, dur: 3.66667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s021.mp4" startFrom={0} /> },
  { key: "foto_82000", start: 82, dur: 2.6, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s022.png" seed={82000} /> },
  { key: "clip_87800", start: 87.8, dur: 3.73333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s023.mp4" startFrom={0} /> },
  { key: "foto_91540", start: 91.53333, dur: 4.33333, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s024.png" seed={91540} /> },
  { key: "foto_95880", start: 95.86667, dur: 7.36667, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s025.png" seed={95880} /> },
  { key: "foto_107160", start: 107.16667, dur: 4.13333, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s026.png" seed={7160} /> },
  { key: "clip_111300", start: 111.3, dur: 3.16667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s100.mp4" startFrom={0} /> },
  { key: "foto_116940", start: 116.93333, dur: 5, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s101.png" seed={16940} /> },
  { key: "clip_123260", start: 123.26667, dur: 3.66667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s102.mp4" startFrom={0} /> },
  { key: "clip_126920", start: 126.93333, dur: 2.7, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s103.mp4" startFrom={0} /> },
  { key: "foto_129680", start: 129.66667, dur: 3.3, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s104.png" seed={29680} /> },
  { key: "foto_132980", start: 132.96667, dur: 6.2, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s105.png" seed={32980} /> },
  { key: "foto_139160", start: 139.16667, dur: 5.4, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s106.png" seed={39160} /> },
  { key: "foto_144560", start: 144.56667, dur: 3.7, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s107.png" seed={44560} /> },
  { key: "clip_149480", start: 149.46667, dur: 2.16667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s109.mp4" startFrom={0} /> },
  { key: "foto_151640", start: 151.63333, dur: 2.9, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s110.png" seed={51640} /> },
  { key: "clip_154860", start: 154.86667, dur: 2.03333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s111.mp4" startFrom={0} /> },
  { key: "clip_156900", start: 156.9, dur: 2.83333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s112.mp4" startFrom={0} /> },
  { key: "clip_159740", start: 159.73333, dur: 2.56667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s113.mp4" startFrom={0} /> },
  { key: "foto_162300", start: 162.3, dur: 4.7, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s114.png" seed={62300} /> },
  { key: "foto_167340", start: 167.33333, dur: 2.23333, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s116.png" seed={67340} /> },
  { key: "foto_169580", start: 169.56667, dur: 2.4, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s117.png" seed={69580} /> },
  { key: "componente_176000", start: 176, dur: 6, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s204.png" seed={76000} /><HighlightSweep durationInFrames={d} theme={THEME_EARTH} {...({"pre":"La mancha no es el problema:","highlight":"es el síntoma","post":"","note":"El que trata la mancha fracasa. El que encuentra de dónde viene el agua, la resuelve para siempre."} as any)} /></> },
  { key: "clip_183780", start: 183.76667, dur: 4.36667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s202.mp4" startFrom={0} /> },
  { key: "clip_188140", start: 188.13333, dur: 3.03333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s203.mp4" startFrom={0} /> },
  { key: "clip_191160", start: 191.16667, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s204.mp4" startFrom={0} /> },
  { key: "movimiento_199500", start: 199.5, dur: 52.5, el: (d) => <MovTresAguas durationInFrames={d} /> },
  { key: "foto_253380", start: 253.36667, dur: 3.86667, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s219.png" seed={53380} /> },
  { key: "foto_257980", start: 257.96667, dur: 3.5, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s220.png" seed={57980} /> },
  { key: "clip_261460", start: 261.46667, dur: 2.03333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s221.mp4" startFrom={0} /> },
  { key: "foto_263500", start: 263.5, dur: 4.66667, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s222.png" seed={63500} /> },
  { key: "clip_268160", start: 268.16667, dur: 1.73333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s223.mp4" startFrom={0} /> },
  { key: "componente_269900", start: 269.9, dur: 9.1, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s224.png" seed={69900} /><ChecklistReveal durationInFrames={d} theme={THEME_EARTH} {...({"kicker":"ANOTA ESTO","title":"La regla de las tres frases","items":["Difusa y arriba, es el aire","Aparece con la lluvia, es de afuera","Abajo, en banda y con polvo blanco, es el suelo"],"stamp":"80%"} as any)} /></> },
  { key: "clip_281220", start: 281.23333, dur: 4.13333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s227.mp4" startFrom={0} /> },
  { key: "clip_285360", start: 285.36667, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s228.mp4" startFrom={0} /> },
  { key: "clip_291560", start: 291.56667, dur: 2.8, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s229.mp4" startFrom={0} /> },
  { key: "movimiento_305500", start: 305.5, dur: 58.9, el: (d) => <MovCloroBorax durationInFrames={d} /> },
  { key: "componente_367540", start: 367.53333, dur: 5.46667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s312.png" seed={67540} /><HighlightSweep durationInFrames={d} theme={THEME_EARTH} {...({"pre":"La solución de bórax","highlight":"no se enjuaga","post":"nunca","note":"Si la enjuagas, le quitas la protección."} as any)} /></> },
  { key: "movimiento_373500", start: 373.5, dur: 57.9, el: (d) => <MovCuatroPasos durationInFrames={d} /> },
  { key: "componente_436900", start: 436.9, dur: 5.1, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s321.png" seed={36900} /><PullQuote durationInFrames={d} theme={THEME_EARTH} {...({"quote":"Si pintas sobre una pared húmeda, la mancha vuelve el cien por ciento de las veces. No es mala suerte, es física.","author":"","role":"","image":"img/clembudo/clembudo_s321.png"} as any)} /></> },
  { key: "clip_443780", start: 443.76667, dur: 3.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s120.mp4" startFrom={0} /> },
  { key: "componente_448680", start: 448.66667, dur: 5.33333, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s324.png" seed={48680} /><BigStatReveal durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"LA VARIANTE DEL TECHO","prefix":"$","value":1,"suffix":"","support":"Un ingrediente más, menos de un dólar. La proporción exacta está en la descripción.","source":""} as any)} /></> },
  { key: "movimiento_457200", start: 457.2, dur: 29.1, el: (d) => <MovDinero durationInFrames={d} /> },
  { key: "movimiento_489400", start: 489.4, dur: 50.6, el: (d) => <MovCaso35 durationInFrames={d} /> },
  { key: "componente_546700", start: 546.7, dur: 5.3, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s414.png" seed={46700} /><PullQuote durationInFrames={d} theme={THEME_EARTH} {...({"quote":"El que sabe decir que no es al que después llaman.","author":"","role":"","image":"img/clembudo/clembudo_s414.png"} as any)} /></> },
  { key: "clip_553520", start: 553.53333, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s418.mp4" startFrom={0} /> },
  { key: "clip_561500", start: 561.5, dur: 3.26667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s419.mp4" startFrom={0} /> },
  { key: "clip_564760", start: 564.76667, dur: 3.33333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s420.mp4" startFrom={0} /> },
  { key: "clip_569300", start: 569.3, dur: 3.16667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s421.mp4" startFrom={0} /> },
  { key: "componente_576040", start: 576.03333, dur: 5.96667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s421.png" seed={76040} /><HighlightSweep durationInFrames={d} theme={THEME_EARTH} {...({"pre":"Estuvo","highlight":"veinte minutos","post":"parado en la vereda","note":"Le parecía demasiado pedir tres mil doscientos pesos. Lo dijo sin justificarse, y la señora aceptó."} as any)} /></> },
  { key: "componente_582200", start: 582.2, dur: 5.2, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s423.png" seed={82200} /><BigStatReveal durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"LO QUE PIDIÓ LUIS","prefix":"$","value":3200,"support":"Tres mil doscientos pesos. Lo dijo sin justificarse, y la señora aceptó.","source":""} as any)} /></> },
  { key: "clip_591900", start: 591.9, dur: 3.16667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s425.mp4" startFrom={0} /> },
  { key: "componente_596040", start: 596.03333, dur: 6.36667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s417.png" seed={96040} /><VsDuel durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"DOS QUE YA ESTÁN HACIENDO ESTO","title":"Andrés es exactamente lo contrario","left":{"label":"Luis","sub":"Repartidor. Nunca cobró una pared.","image":"img/clembudo/clembudo_s418.png"},"right":{"label":"Andrés","sub":"Pintor, años de oficio en el cuerpo.","image":"img/clembudo/clembudo_s426.png"}} as any)} /></> },
  { key: "clip_605860", start: 605.86667, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s427.mp4" startFrom={0} /> },
  { key: "clip_611600", start: 611.6, dur: 2.73333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s428.mp4" startFrom={0} /> },
  { key: "clip_614340", start: 614.33333, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s429.mp4" startFrom={0} /> },
  { key: "clip_621160", start: 621.16667, dur: 4.93333, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s430.mp4" startFrom={0} /> },
  { key: "componente_644960", start: 644.96667, dur: 5.53333, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s430.png" seed={44960} /><PullQuote durationInFrames={d} theme={THEME_EARTH} {...({"quote":"No es dinero fácil. Es dinero simple, que es distinto.","author":"","role":"","image":"img/clembudo/clembudo_s430.png"} as any)} /></> },
  { key: "movimiento_653000", start: 653, dur: 41.3, el: (d) => <MovCierre durationInFrames={d} /> },
  { key: "componente_694340", start: 694.33333, dur: 8.66667, el: (d) => <><ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s441.png" seed={94340} /><CtaCard durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"EL CURSO","title":"De $3 a $180 por Pared","bullet":"16 clases · el cuaderno del oficio · 15 días de garantía","price":0,"cta":"El enlace está en la descripción","image":"img/vslcurso_portada.jpg"} as any)} /></> },
  { key: "foto_705760", start: 705.76667, dur: 5.1, el: (d) => <ClPhoto durationInFrames={d} src="img/clembudo/clembudo_s440.png" seed={5760} /> },
  { key: "clip_712100", start: 712.1, dur: 2.66667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s441.mp4" startFrom={0} /> },
  { key: "clip_717660", start: 717.66667, dur: 3.06667, el: (d) => <ClClip durationInFrames={d} src="broll/clembudo/clembudo_s442.mp4" startFrom={0} /> },
];

export const OVERLAYS: { key: string; start: number; dur: number; el: (d: number) => React.ReactNode }[] = [
  { key: "qr_295860", start: 295.86667, dur: 6.2, el: (d) => <FloatingInsert durationInFrames={d} src="img/vslcurso_qr_land.png" side="right" kicker="Escanea con tu celular" hue="amber" /> },
  { key: "qr_721960", start: 721.96667, dur: 9, el: (d) => <FloatingInsert durationInFrames={d} src="img/vslcurso_qr_land.png" side="right" kicker="Escanea con tu celular" hue="amber" /> },
];

export const SFXCUES: { start: number; src: string; vol: number }[] = [];
