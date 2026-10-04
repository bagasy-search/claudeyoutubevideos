// cues_lupebebes.gen.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { PullQuote } from "../rksafe/PullQuote";
import { SceneCallout } from "../rksafe/SceneCallout";
import { Clip, Foto } from "../rksafe/RayStage";
import type { TransKind } from "../rksafe/RayTrans";
import { RayAvatarWin } from "../rksafe/RayAvatarWin";

export type Cue = { key: string; start: number; dur: number; tin?: TransKind; tout?: TransKind; ov?: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "avatar_0", start: 0, dur: 4.733333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w000.mp4" seed={0} durF={d} /> },
  { key: "componente_4733", start: 4.733333333333333, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s1_02.jpg","at":[50,50],"kicker":"EN LA IGLESIA, EN EL MERCADO","label":"Se te queda mirando a ti","sub":"Nomás a ti.","bed":"img/lupebebes_s1_01_blur.jpg"} as any)} /> },
  { key: "imagen_12733", start: 12.733333333333333, dur: 4.033333333333333, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s1_01.jpg" seed={382} durF={d} /> },
  { key: "imagen_16767", start: 16.766666666666666, dur: 6.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s1_02.jpg" seed={503} durF={d} /> },
  { key: "clip_23167", start: 23.166666666666668, dur: 4.533333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p02.mp4" rate={1} /> },
  { key: "componente_27700", start: 27.7, dur: 9, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s1_05.jpg","at":[50,45],"kicker":"LO QUE DECÍAN LOS VIEJOS","label":"Ven algo que la gente grande ya no ve","color":"ok","bed":"img/lupebebes_s1_01_blur.jpg"} as any)} /> },
  { key: "avatar_36700", start: 36.7, dur: 6.333333333333333, tin: "iris", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w001.mp4" seed={1101} durF={d} bed="img/lupebebes_s1_02_blur.jpg" /> },
  { key: "clip_43033", start: 43.03333333333333, dur: 5.6, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e04.mp4" rate={1} /> },
  { key: "clip_48633", start: 48.63333333333333, dur: 8.066666666666666, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_c13.mp4" rate={1} /> },
  { key: "clip_56700", start: 56.7, dur: 1.9333333333333333, tin: "iris", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_a04.mp4" rate={1} /> },
  { key: "componente_58633", start: 58.63333333333333, dur: 4.733333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s2_02.jpg","at":[45,60],"kicker":"EL CUADERNITO","label":"Lo que me enseñó mi madre","color":"ok","bed":"img/lupebebes_s2_01_blur.jpg"} as any)} /> },
  { key: "avatar_63367", start: 63.36666666666667, dur: 11.866666666666667, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w002.mp4" seed={1901} durF={d} bed="img/lupebebes_s1_02_blur.jpg" /> },
  { key: "componente_75233", start: 75.23333333333333, dur: 9, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s3_01.jpg","at":[50,45],"kicker":"MI TÍA CHAYO","label":"Los bebés se le callaban","sub":"Y los perros la seguían al mercado.","bed":"img/lupebebes_s3_01_blur.jpg"} as any)} /> },
  { key: "clip_84233", start: 84.23333333333333, dur: 4.033333333333333, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_r05.mp4" rate={1} /> },
  { key: "imagen_88267", start: 88.26666666666667, dur: 7.4, tin: "push", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s3_01.jpg" seed={2648} durF={d} /> },
  { key: "avatar_95667", start: 95.66666666666667, dur: 5.2, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w003.mp4" seed={2870} durF={d} bed="img/lupebebes_s3_01_blur.jpg" /> },
  { key: "clip_100867", start: 100.86666666666666, dur: 1.3666666666666667, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p09.mp4" rate={1} /> },
  { key: "componente_102233", start: 102.23333333333333, dur: 7.833333333333333, tin: "cut", tout: "push", ov: 10, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"No buscan a la que tiene hijos. Buscan a la que tiene el corazón en paz.","attrib":"— la madre de Lupe","bed":"img/lupebebes_s3_01_blur.jpg"} as any)} /> },
  { key: "avatar_110067", start: 110.06666666666666, dur: 6.6, tin: "push", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w004.mp4" seed={3302} durF={d} bed="img/lupebebes_s3_01_blur.jpg" /> },
  { key: "clip_116667", start: 116.66666666666667, dur: 3, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p22.mp4" rate={1} /> },
  { key: "componente_119667", start: 119.66666666666667, dur: 10, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s3_05.jpg","at":[50,50],"kicker":"TRES COSAS","label":"¿Eres una de ellas?","steps":["Sienten la calma","Los miras de verdad","Tienes algo que dar"],"bed":"img/lupebebes_s3_01_blur.jpg"} as any)} /> },
  { key: "componente_129667", start: 129.66666666666666, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s4_01.jpg","at":[50,55],"kicker":"LA PRIMERA","label":"Sienten la calma","sub":"No entienden palabras. Sienten.","bed":"img/lupebebes_s4_01_blur.jpg"} as any)} /> },
  { key: "clip_137667", start: 137.66666666666666, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_r07.mp4" rate={1} /> },
  { key: "clip_141700", start: 141.7, dur: 7.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p03.mp4" rate={1} /> },
  { key: "clip_149100", start: 149.1, dur: 5.2, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e01.mp4" rate={1} /> },
  { key: "clip_154300", start: 154.3, dur: 8.066666666666666, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e11.mp4" rate={1} /> },
  { key: "avatar_162367", start: 162.36666666666667, dur: 6, tin: "iris", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w005.mp4" seed={4871} durF={d} bed="img/lupebebes_s3_01_blur.jpg" /> },
  { key: "componente_168367", start: 168.36666666666667, dur: 8, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s4_04.jpg","at":[50,45],"kicker":"LA CALMA SE APRENDE","label":"Y se nota de lejos","color":"ok","bed":"img/lupebebes_s4_01_blur.jpg"} as any)} /> },
  { key: "clip_176367", start: 176.36666666666667, dur: 4.6, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e02.mp4" rate={1} /> },
  { key: "clip_180967", start: 180.96666666666667, dur: 4.866666666666666, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e07.mp4" rate={1} /> },
  { key: "componente_185833", start: 185.83333333333334, dur: 8, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s5_01.jpg","at":[50,50],"kicker":"LA SEGUNDA","label":"Los miras de verdad","sub":"Les das tu tiempo.","bed":"img/lupebebes_s5_01_blur.jpg"} as any)} /> },
  { key: "clip_193833", start: 193.83333333333334, dur: 4.033333333333333, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p27.mp4" rate={1} /> },
  { key: "imagen_197867", start: 197.86666666666667, dur: 7.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s5_01.jpg" seed={5936} durF={d} /> },
  { key: "avatar_205267", start: 205.26666666666668, dur: 5.2, tin: "wipe", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w006.mp4" seed={6158} durF={d} bed="img/lupebebes_s5_01_blur.jpg" /> },
  { key: "clip_210467", start: 210.46666666666667, dur: 8.066666666666666, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_c03.mp4" rate={1} /> },
  { key: "avatar_218533", start: 218.53333333333333, dur: 6.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w007.mp4" seed={6556} durF={d} bed="img/lupebebes_s5_01_blur.jpg" /> },
  { key: "clip_225133", start: 225.13333333333333, dur: 3.7333333333333334, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_a12.mp4" rate={1} /> },
  { key: "componente_228867", start: 228.86666666666667, dur: 8, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s5_05.jpg","at":[50,45],"kicker":"MI RAMÓN","label":"\"Usted tiene mano\"","color":"ok","bed":"img/lupebebes_s5_01_blur.jpg"} as any)} /> },
  { key: "avatar_236867", start: 236.86666666666667, dur: 7.8, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w008.mp4" seed={7106} durF={d} bed="img/lupebebes_s5_01_blur.jpg" /> },
  { key: "imagen_244667", start: 244.66666666666666, dur: 6, tin: "iris", tout: "push", ov: 10, el: (d) => <Foto src="img/lupebebes_s5_05.jpg" seed={7340} durF={d} /> },
  { key: "avatar_250667", start: 250.66666666666666, dur: 3.2333333333333334, tin: "push", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w009.mp4" seed={7520} durF={d} bed="img/lupebebes_s5_05_blur.jpg" /> },
  { key: "componente_253900", start: 253.9, dur: 8, tin: "push", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s6_02.jpg","at":[50,55],"kicker":"LA TERCERA","label":"Todavía tienes mucho que dar","color":"ok","bed":"img/lupebebes_s6_01_blur.jpg"} as any)} /> },
  { key: "clip_261900", start: 261.9, dur: 4.033333333333333, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_r11.mp4" rate={1} /> },
  { key: "clip_265933", start: 265.93333333333334, dur: 7.4, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_c20.mp4" rate={1} /> },
  { key: "avatar_273333", start: 273.3333333333333, dur: 5.2, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w010.mp4" seed={8200} durF={d} bed="img/lupebebes_s5_05_blur.jpg" /> },
  { key: "clip_278533", start: 278.53333333333336, dur: 8.066666666666666, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_r13.mp4" rate={1} /> },
  { key: "avatar_286600", start: 286.6, dur: 2.1333333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w011.mp4" seed={8598} durF={d} bed="img/lupebebes_s5_05_blur.jpg" /> },
  { key: "componente_288733", start: 288.73333333333335, dur: 6.433333333333334, tin: "wipe", tout: "cut", ov: 10, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"Mientras una criatura te busque, tienes una tarea en este mundo.","attrib":"— la madre de Lupe","bed":"img/lupebebes_s6_01_blur.jpg"} as any)} /> },
  { key: "avatar_295167", start: 295.1666666666667, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w012.mp4" seed={8855} durF={d} bed="img/lupebebes_s5_05_blur.jpg" /> },
  { key: "imagen_299767", start: 299.76666666666665, dur: 7.966666666666667, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s6_04.jpg" seed={8993} durF={d} /> },
  { key: "componente_307733", start: 307.73333333333335, dur: 10, tin: "zoom", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s7_01.jpg","at":[50,50],"kicker":"PARA ESTA SEMANA","label":"Tres cositas","steps":["Mírale de vuelta","Saluda a los perros","Comparte tu calma"],"bed":"img/lupebebes_s7_01_blur.jpg"} as any)} /> },
  { key: "componente_317733", start: 317.73333333333335, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s7_02.jpg","at":[50,50],"kicker":"LA PRIMERA","label":"Sin prisa. Sonríele despacito.","color":"ok","bed":"img/lupebebes_s7_01_blur.jpg"} as any)} /> },
  { key: "clip_325733", start: 325.73333333333335, dur: 1.9, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_c15.mp4" rate={1} /> },
  { key: "componente_327633", start: 327.6333333333333, dur: 9, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s7_03.jpg","at":[50,50],"kicker":"LA SEGUNDA","label":"Hay perros que necesitan a alguien como tú","color":"ok","bed":"img/lupebebes_s7_01_blur.jpg"} as any)} /> },
  { key: "clip_336633", start: 336.6333333333333, dur: 7.4, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_c29.mp4" rate={1} /> },
  { key: "clip_344033", start: 344.03333333333336, dur: 4.033333333333333, tin: "iris", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_e15.mp4" rate={1} /> },
  { key: "clip_348067", start: 348.06666666666666, dur: 4.566666666666666, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p06.mp4" rate={1} /> },
  { key: "componente_352633", start: 352.6333333333333, dur: 9, tin: "wipe", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s7_05.jpg","at":[50,45],"kicker":"LA TERCERA","label":"Esa paz es para todos","sub":"La vecina, la nuera, el nieto.","bed":"img/lupebebes_s7_01_blur.jpg"} as any)} /> },
  { key: "avatar_361633", start: 361.6333333333333, dur: 6, tin: "zoom", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w013.mp4" seed={10849} durF={d} bed="img/lupebebes_s6_04_blur.jpg" /> },
  { key: "imagen_367633", start: 367.6333333333333, dur: 7.8, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s7_01.jpg" seed={11029} durF={d} /> },
  { key: "avatar_375433", start: 375.43333333333334, dur: 2.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w014.mp4" seed={11263} durF={d} bed="img/lupebebes_s7_01_blur.jpg" /> },
  { key: "clip_377833", start: 377.8333333333333, dur: 6.2, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_r14.mp4" rate={1} /> },
  { key: "clip_384033", start: 384.03333333333336, dur: 2.8666666666666667, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p04.mp4" rate={1} /> },
  { key: "componente_386900", start: 386.9, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupebebes_s8_02.jpg","at":[50,55],"kicker":"CUÉNTAME","label":"¿A ti te buscan?","sub":"¿Cuál fue la última vez?","bed":"img/lupebebes_s8_01_blur.jpg"} as any)} /> },
  { key: "clip_394900", start: 394.9, dur: 4.6, tin: "iris", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupebebes_real/lupebebes_p28.mp4" rate={1} /> },
  { key: "avatar_399500", start: 399.5, dur: 7.6, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w015.mp4" seed={11985} durF={d} bed="img/lupebebes_s7_01_blur.jpg" /> },
  { key: "imagen_407100", start: 407.1, dur: 5.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupebebes_s1_03.jpg" seed={12213} durF={d} /> },
  { key: "avatar_412500", start: 412.5, dur: 9.466666666666667, tin: "cut", tout: "cut", ov: 0, el: (d) => <RayAvatarWin src="broll/lupebebes/av_w016.mp4" seed={12375} durF={d} bed="img/lupebebes_s1_03_blur.jpg" /> },
];

export const OVERLAYS: Cue[] = [

];
