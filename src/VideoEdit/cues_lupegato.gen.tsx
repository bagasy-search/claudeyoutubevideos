// cues_lupegato.gen.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { PullQuote } from "../rksafe/PullQuote";
import { SceneCallout } from "../rksafe/SceneCallout";
import { Clip, Foto } from "../rksafe/RayStage";
import type { TransKind } from "../rksafe/RayTrans";
import { RayAvatarWin } from "../rksafe/RayAvatarWin";

export type Cue = { key: string; start: number; dur: number; tin?: TransKind; tout?: TransKind; ov?: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "avatar_0", start: 0, dur: 6.233333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w000.mp4" seed={0} durF={d} /> },
  { key: "imagen_6233", start: 6.233333333333333, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s1_02.jpg" seed={187} durF={d} /> },
  { key: "clip_10267", start: 10.266666666666667, dur: 6.4, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r01.mp4" rate={1} /> },
  { key: "clip_16667", start: 16.666666666666668, dur: 4.133333333333334, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r02.mp4" rate={1} /> },
  { key: "componente_20800", start: 20.8, dur: 7, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s1_03.jpg","at":[50,60],"kicker":"NO ES POR EL FRÍO","label":"Te escogió a ti","sub":"Esta noche te digo por qué.","bed":"img/lupegato_s1_01_blur.jpg"} as any)} /> },
  { key: "clip_27800", start: 27.8, dur: 4.7, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r03.mp4" rate={1} /> },
  { key: "clip_32500", start: 32.5, dur: 5.6, tin: "iris", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r04.mp4" rate={1} /> },
  { key: "clip_38100", start: 38.1, dur: 8.066666666666666, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r05.mp4" rate={1} /> },
  { key: "avatar_46167", start: 46.166666666666664, dur: 6.833333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w001.mp4" seed={1385} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "componente_53000", start: 53, dur: 9, tin: "iris", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s2_03.jpg","at":[30,45],"kicker":"LO QUE SABÍAN LOS VIEJOS","label":"Tres cosas","steps":["Donde te duele","Te ronronea","Cuida tus sueños"],"bed":"img/lupegato_s2_01_blur.jpg"} as any)} /> },
  { key: "avatar_62000", start: 62, dur: 6.133333333333334, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w002.mp4" seed={1860} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "clip_68133", start: 68.13333333333334, dur: 5.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r07.mp4" rate={1} /> },
  { key: "avatar_73733", start: 73.73333333333333, dur: 7.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w003.mp4" seed={2212} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "componente_81133", start: 81.13333333333334, dur: 8, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s3_01.jpg","at":[55,60],"kicker":"EL PERRO, A GRITOS","label":"El gato, en voz bajita","sub":"Pero cuando quiere, escoge.","bed":"img/lupegato_s3_01_blur.jpg"} as any)} /> },
  { key: "avatar_89133", start: 89.13333333333334, dur: 9.5, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w004.mp4" seed={2674} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "clip_98633", start: 98.63333333333334, dur: 5.6, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r08.mp4" rate={1} /> },
  { key: "clip_104233", start: 104.23333333333333, dur: 8.166666666666666, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r09.mp4" rate={1} /> },
  { key: "componente_112400", start: 112.4, dur: 5.96667, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s4_01.jpg","at":[55,55],"kicker":"EL CUADERNITO","label":"Lo que me enseñó mi madre","color":"ok","bed":"img/lupegato_s4_01_blur.jpg"} as any)} /> },
  { key: "avatar_118367", start: 118.36666666666666, dur: 8.166666666666666, tin: "push", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w005.mp4" seed={3551} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "componente_126533", start: 126.53333333333333, dur: 7, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s5_01.jpg","at":[50,55],"kicker":"LA PRIMERA","label":"Se acuesta donde te duele","bed":"img/lupegato_s5_01_blur.jpg"} as any)} /> },
  { key: "clip_133533", start: 133.53333333333333, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r11.mp4" rate={1} /> },
  { key: "avatar_137567", start: 137.56666666666666, dur: 8.133333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w006.mp4" seed={4127} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "componente_145700", start: 145.7, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s5_03.jpg","at":[55,70],"kicker":"NO SOY DOCTORA","label":"Una compresa tibia que respira","sub":"Para curar, el doctor.","bed":"img/lupegato_s5_01_blur.jpg"} as any)} /> },
  { key: "avatar_153700", start: 153.7, dur: 8.066666666666666, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w007.mp4" seed={4611} durF={d} bed="img/lupegato_s1_02_blur.jpg" /> },
  { key: "imagen_161767", start: 161.76666666666668, dur: 6.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s5_03.jpg" seed={4853} durF={d} /> },
  { key: "avatar_168367", start: 168.36666666666667, dur: 8.8, tin: "zoom", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w008.mp4" seed={5051} durF={d} bed="img/lupegato_s5_03_blur.jpg" /> },
  { key: "componente_177167", start: 177.16666666666666, dur: 7, tin: "iris", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s6_01.jpg","at":[55,50],"kicker":"LA SEGUNDA","label":"Te ronronea cuando estás sola","bed":"img/lupegato_s6_01_blur.jpg"} as any)} /> },
  { key: "componente_184167", start: 184.16666666666666, dur: 4.466666666666667, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s6_02.jpg","at":[50,60],"kicker":"COMO A SUS GATITOS","label":"Tranquila, aquí estoy","color":"ok","bed":"img/lupegato_s6_01_blur.jpg"} as any)} /> },
  { key: "clip_188633", start: 188.63333333333333, dur: 4.033333333333333, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r12.mp4" rate={1} /> },
  { key: "clip_192667", start: 192.66666666666666, dur: 7.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r13.mp4" rate={1} /> },
  { key: "clip_200067", start: 200.06666666666666, dur: 5.2, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r16.mp4" rate={1} /> },
  { key: "clip_205267", start: 205.26666666666668, dur: 4, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r14.mp4" rate={1} /> },
  { key: "componente_209267", start: 209.26666666666668, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s6_03.jpg","at":[55,50],"kicker":"NIEVE, EL PRIMER AÑO","label":"En la almohada de Ramón","bed":"img/lupegato_s6_01_blur.jpg"} as any)} /> },
  { key: "clip_217267", start: 217.26666666666668, dur: 6.6, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r17.mp4" rate={1} /> },
  { key: "clip_223867", start: 223.86666666666667, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r15.mp4" rate={1} /> },
  { key: "avatar_228467", start: 228.46666666666667, dur: 3.066666666666667, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w009.mp4" seed={6854} durF={d} bed="img/lupegato_s5_03_blur.jpg" /> },
  { key: "componente_231533", start: 231.53333333333333, dur: 5.3, tin: "wipe", tout: "cut", ov: 10, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"Un gato que te acompaña es una bendición.","attrib":"— la Abuela Lupe","bed":"img/lupegato_s6_01_blur.jpg"} as any)} /> },
  { key: "avatar_236833", start: 236.83333333333334, dur: 9.6, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w010.mp4" seed={7105} durF={d} bed="img/lupegato_s5_03_blur.jpg" /> },
  { key: "componente_246433", start: 246.43333333333334, dur: 8, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s7_01.jpg","at":[45,70],"kicker":"LA TERCERA","label":"Con la cabeza hacia la puerta","sub":"Lo que me contó mi madre.","bed":"img/lupegato_s7_01_blur.jpg"} as any)} /> },
  { key: "imagen_254433", start: 254.43333333333334, dur: 4.033333333333333, tin: "iris", tout: "push", ov: 10, el: (d) => <Foto src="img/lupegato_s7_03.jpg" seed={7633} durF={d} /> },
  { key: "clip_258467", start: 258.46666666666664, dur: 7.4, tin: "push", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r18.mp4" rate={1} /> },
  { key: "avatar_265867", start: 265.8666666666667, dur: 8.366666666666667, tin: "push", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w011.mp4" seed={7976} durF={d} bed="img/lupegato_s7_03_blur.jpg" /> },
  { key: "componente_274233", start: 274.23333333333335, dur: 9, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s7_03.jpg","at":[50,55],"kicker":"LO QUE DECÍAN LOS VIEJOS","label":"Guardia de tus sueños","stamp":"TE ESCOGIÓ","color":"ok","bed":"img/lupegato_s7_01_blur.jpg"} as any)} /> },
  { key: "avatar_283233", start: 283.23333333333335, dur: 11.2, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w012.mp4" seed={8497} durF={d} bed="img/lupegato_s7_03_blur.jpg" /> },
  { key: "clip_294433", start: 294.43333333333334, dur: 7.8, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r20.mp4" rate={1} /> },
  { key: "avatar_302233", start: 302.23333333333335, dur: 6, tin: "zoom", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w013.mp4" seed={9067} durF={d} bed="img/lupegato_s7_03_blur.jpg" /> },
  { key: "clip_308233", start: 308.23333333333335, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupegato_real/lupegato_r21.mp4" rate={1} /> },
  { key: "imagen_312267", start: 312.26666666666665, dur: 7.4, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s7_03.jpg" seed={9368} durF={d} /> },
  { key: "avatar_319667", start: 319.6666666666667, dur: 1.8666666666666667, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w014.mp4" seed={9590} durF={d} bed="img/lupegato_s7_03_blur.jpg" /> },
  { key: "componente_321533", start: 321.53333333333336, dur: 10, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s8_01.jpg","at":[50,60],"kicker":"PARA ESTA SEMANA","label":"Tres cositas","steps":["Déjalo dormir contigo","Fíjate dónde se acuesta","Respira con él"],"bed":"img/lupegato_s8_01_blur.jpg"} as any)} /> },
  { key: "avatar_331533", start: 331.53333333333336, dur: 5.2, tin: "zoom", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w015.mp4" seed={9946} durF={d} bed="img/lupegato_s7_03_blur.jpg" /> },
  { key: "imagen_336733", start: 336.73333333333335, dur: 7.8, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s8_02.jpg" seed={10102} durF={d} /> },
  { key: "componente_344533", start: 344.53333333333336, dur: 7, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s5_04.jpg","at":[45,55],"kicker":"SI EL DOLOR NO SE QUITA","label":"Ve con tu doctor","sub":"El gato avisa. El doctor cura.","color":"danger","bed":"img/lupegato_s8_01_blur.jpg"} as any)} /> },
  { key: "avatar_351533", start: 351.53333333333336, dur: 8.7, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w016.mp4" seed={10546} durF={d} bed="img/lupegato_s8_02_blur.jpg" /> },
  { key: "componente_360233", start: 360.23333333333335, dur: 8, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s8_04.jpg","at":[50,55],"kicker":"DIOS MANDA COMPAÑÍA","label":"A veces viene con bigotes","color":"ok","bed":"img/lupegato_s8_01_blur.jpg"} as any)} /> },
  { key: "imagen_368233", start: 368.23333333333335, dur: 7.8, tin: "iris", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s8_02.jpg" seed={11047} durF={d} /> },
  { key: "imagen_376033", start: 376.03333333333336, dur: 2, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s1_01.jpg" seed={11281} durF={d} /> },
  { key: "avatar_378033", start: 378.03333333333336, dur: 5.8, tin: "wipe", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupegato/av_w017.mp4" seed={11341} durF={d} bed="img/lupegato_s1_01_blur.jpg" /> },
  { key: "componente_383833", start: 383.8333333333333, dur: 9, tin: "zoom", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupegato_s9_02.jpg","at":[50,55],"kicker":"CUÉNTAME","label":"¿Cómo se llama tu gato?","sub":"¿Y dónde se te acuesta?","bed":"img/lupegato_s9_01_blur.jpg"} as any)} /> },
  { key: "imagen_392833", start: 392.8333333333333, dur: 8.066666666666666, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s9_02.jpg" seed={11785} durF={d} /> },
  { key: "imagen_400900", start: 400.9, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s9_04.jpg" seed={12027} durF={d} /> },
  { key: "imagen_405500", start: 405.5, dur: 7.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupegato_s9_03.jpg" seed={12165} durF={d} /> },
  { key: "imagen_413100", start: 413.1, dur: 3.433333333333333, tin: "wipe", tout: "cut", ov: 0, el: (d) => <Foto src="img/lupegato_s1_02.jpg" seed={12393} durF={d} /> },
];

export const OVERLAYS: Cue[] = [

];
