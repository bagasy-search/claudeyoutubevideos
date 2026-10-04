// cues_lupeanos.gen.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { PullQuote } from "../rksafe/PullQuote";
import { SceneCallout } from "../rksafe/SceneCallout";
import { Clip, Foto } from "../rksafe/RayStage";
import type { TransKind } from "../rksafe/RayTrans";
import { RayAvatarWin } from "../rksafe/RayAvatarWin";

export type Cue = { key: string; start: number; dur: number; tin?: TransKind; tout?: TransKind; ov?: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
  { key: "avatar_0", start: 0, dur: 4.766666666666667, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w000.mp4" seed={0} durF={d} /> },
  { key: "componente_4767", start: 4.766666666666667, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s1_01.jpg","at":[50,50],"kicker":"A LOS OCHENTA","label":"Pensé que nada más me tocaba esperar","bed":"img/lupeanos_s1_01_blur.jpg"} as any)} /> },
  { key: "imagen_12767", start: 12.766666666666667, dur: 3.8, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_01.jpg" seed={383} durF={d} /> },
  { key: "componente_16567", start: 16.566666666666666, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s1_02.jpg","at":[50,45],"kicker":"ME EQUIVOQUÉ","label":"Los mejores años de mi vida","color":"ok","bed":"img/lupeanos_s1_01_blur.jpg"} as any)} /> },
  { key: "imagen_24567", start: 24.566666666666666, dur: 6.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_02.jpg" seed={737} durF={d} /> },
  { key: "clip_30967", start: 30.966666666666665, dur: 5.9, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p04.mp4" rate={1} /> },
  { key: "avatar_36867", start: 36.86666666666667, dur: 5.6, tin: "iris", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w001.mp4" seed={1106} durF={d} bed="img/lupeanos_s1_02_blur.jpg" /> },
  { key: "clip_42467", start: 42.46666666666667, dur: 8.066666666666666, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p03.mp4" rate={1} /> },
  { key: "avatar_50533", start: 50.53333333333333, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w002.mp4" seed={1516} durF={d} bed="img/lupeanos_s1_02_blur.jpg" /> },
  { key: "imagen_55133", start: 55.13333333333333, dur: 7.8, tin: "iris", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s2_03.jpg" seed={1654} durF={d} /> },
  { key: "avatar_62933", start: 62.93333333333333, dur: 9.833333333333334, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w003.mp4" seed={1888} durF={d} bed="img/lupeanos_s2_03_blur.jpg" /> },
  { key: "componente_72767", start: 72.76666666666667, dur: 11, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s2_03.jpg","at":[50,45],"kicker":"DESPUÉS DE LOS OCHENTA","label":"Tres cosas que aprendí","steps":["Ya no tengo prisa","Ya no quedo bien con nadie","Sé lo que importa"],"bed":"img/lupeanos_s2_01_blur.jpg"} as any)} /> },
  { key: "componente_83767", start: 83.76666666666667, dur: 7, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s3_03.jpg","at":[50,50],"kicker":"LA PRIMERA","label":"Ya no tengo prisa","bed":"img/lupeanos_s3_01_blur.jpg"} as any)} /> },
  { key: "clip_90767", start: 90.76666666666667, dur: 4.033333333333333, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c31.mp4" rate={1} /> },
  { key: "avatar_94800", start: 94.8, dur: 7.4, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w004.mp4" seed={2844} durF={d} bed="img/lupeanos_s2_03_blur.jpg" /> },
  { key: "clip_102200", start: 102.2, dur: 5.2, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_r09.mp4" rate={1} /> },
  { key: "clip_107400", start: 107.4, dur: 8.066666666666666, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_r03.mp4" rate={1} /> },
  { key: "clip_115467", start: 115.46666666666667, dur: 6.6, tin: "cut", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c02.mp4" rate={1} /> },
  { key: "clip_122067", start: 122.06666666666666, dur: 5.8, tin: "push", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p08.mp4" rate={1} /> },
  { key: "componente_127867", start: 127.86666666666666, dur: 7.566666666666666, tin: "push", tout: "cut", ov: 10, el: (d) => <PullQuote durationInFrames={d} {...({"quote":"La vejez es cuando Dios por fin te deja sentarte a mirar lo que hizo.","attrib":"— la madre de Lupe","bed":"img/lupeanos_s3_01_blur.jpg"} as any)} /> },
  { key: "clip_135433", start: 135.43333333333334, dur: 6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c19.mp4" rate={1} /> },
  { key: "clip_141433", start: 141.43333333333334, dur: 2.8333333333333335, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c20.mp4" rate={1} /> },
  { key: "componente_144267", start: 144.26666666666668, dur: 8, tin: "cut", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s4_02.jpg","at":[50,45],"kicker":"LA SEGUNDA","label":"Ya no tengo que quedar bien con nadie","bed":"img/lupeanos_s4_01_blur.jpg"} as any)} /> },
  { key: "clip_152267", start: 152.26666666666668, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c32.mp4" rate={1} /> },
  { key: "avatar_156300", start: 156.3, dur: 7.4, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w005.mp4" seed={4689} durF={d} bed="img/lupeanos_s2_03_blur.jpg" /> },
  { key: "imagen_163700", start: 163.7, dur: 5.2, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_01.jpg" seed={4911} durF={d} /> },
  { key: "clip_168900", start: 168.9, dur: 8.066666666666666, tin: "iris", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_t07.mp4" rate={1} /> },
  { key: "avatar_176967", start: 176.96666666666667, dur: 6.9, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w006.mp4" seed={5309} durF={d} bed="img/lupeanos_s1_01_blur.jpg" /> },
  { key: "componente_183867", start: 183.86666666666667, dur: 8, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s4_03.jpg","at":[50,45],"kicker":"ESA LIBERTAD","label":"No la tuve nunca de joven","color":"ok","bed":"img/lupeanos_s4_01_blur.jpg"} as any)} /> },
  { key: "avatar_191867", start: 191.86666666666667, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w007.mp4" seed={5756} durF={d} bed="img/lupeanos_s1_01_blur.jpg" /> },
  { key: "imagen_196467", start: 196.46666666666667, dur: 8.766666666666667, tin: "cut", tout: "push", ov: 10, el: (d) => <Foto src="img/lupeanos_s4_05.jpg" seed={5894} durF={d} /> },
  { key: "componente_205233", start: 205.23333333333332, dur: 10, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s5_02.jpg","at":[50,45],"kicker":"LA TERCERA","label":"Lo que de verdad importa","steps":["La gente","El tiempo","La fe"],"bed":"img/lupeanos_s5_02_blur.jpg"} as any)} /> },
  { key: "clip_215233", start: 215.23333333333332, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_g21.mp4" rate={1} /> },
  { key: "avatar_219267", start: 219.26666666666668, dur: 7.4, tin: "wipe", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w008.mp4" seed={6578} durF={d} bed="img/lupeanos_s4_05_blur.jpg" /> },
  { key: "imagen_226667", start: 226.66666666666666, dur: 5.2, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_02.jpg" seed={6800} durF={d} /> },
  { key: "clip_231867", start: 231.86666666666667, dur: 8.066666666666666, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p17.mp4" rate={1} /> },
  { key: "clip_239933", start: 239.93333333333334, dur: 6.6, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_a21.mp4" rate={1} /> },
  { key: "avatar_246533", start: 246.53333333333333, dur: 11.5, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w009.mp4" seed={7396} durF={d} bed="img/lupeanos_s1_02_blur.jpg" /> },
  { key: "componente_258033", start: 258.03333333333336, dur: 9, tin: "push", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s5_05.jpg","at":[50,50],"kicker":"A LOS OCHENTA Y OCHO","label":"La galería más llena de mi vida","color":"ok","bed":"img/lupeanos_s5_02_blur.jpg"} as any)} /> },
  { key: "avatar_267033", start: 267.03333333333336, dur: 6, tin: "iris", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w010.mp4" seed={8011} durF={d} bed="img/lupeanos_s1_02_blur.jpg" /> },
  { key: "clip_273033", start: 273.03333333333336, dur: 4.033333333333333, tin: "push", tout: "push", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_g04.mp4" rate={1} /> },
  { key: "imagen_277067", start: 277.06666666666666, dur: 7.4, tin: "push", tout: "push", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_01.jpg" seed={8312} durF={d} /> },
  { key: "avatar_284467", start: 284.46666666666664, dur: 4.666666666666667, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w011.mp4" seed={8534} durF={d} bed="img/lupeanos_s1_01_blur.jpg" /> },
  { key: "componente_289133", start: 289.1333333333333, dur: 10, tin: "cut", tout: "push", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s6_01.jpg","at":[50,50],"kicker":"PARA ESTA SEMANA","label":"Tres cositas","steps":["Mira algo despacio","Haz algo sin qué dirán","Escríbele a alguien"],"bed":"img/lupeanos_s6_01_blur.jpg"} as any)} /> },
  { key: "avatar_299133", start: 299.1333333333333, dur: 5.2, tin: "push", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w012.mp4" seed={8974} durF={d} bed="img/lupeanos_s1_01_blur.jpg" /> },
  { key: "clip_304333", start: 304.3333333333333, dur: 7.4, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_r12.mp4" rate={1} /> },
  { key: "clip_311733", start: 311.73333333333335, dur: 4.033333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c23.mp4" rate={1} /> },
  { key: "clip_315767", start: 315.76666666666665, dur: 8.066666666666666, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_c26.mp4" rate={1} /> },
  { key: "clip_323833", start: 323.8333333333333, dur: 6, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_a20.mp4" rate={1} /> },
  { key: "clip_329833", start: 329.8333333333333, dur: 2.533333333333333, tin: "cut", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_t16.mp4" rate={1} /> },
  { key: "componente_332367", start: 332.3666666666667, dur: 8, tin: "zoom", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s6_04.jpg","at":[50,50],"kicker":"EL TIEMPO NO ESTÁ PROMETIDO","label":"Dile que lo quieres","sub":"Esta semana.","color":"ok","bed":"img/lupeanos_s6_01_blur.jpg"} as any)} /> },
  { key: "avatar_340367", start: 340.3666666666667, dur: 4.6, tin: "cut", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w013.mp4" seed={10211} durF={d} bed="img/lupeanos_s1_01_blur.jpg" /> },
  { key: "imagen_344967", start: 344.96666666666664, dur: 5.3, tin: "cut", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s2_03.jpg" seed={10349} durF={d} /> },
  { key: "avatar_350267", start: 350.26666666666665, dur: 6.2, tin: "cut", tout: "push", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w014.mp4" seed={10508} durF={d} bed="img/lupeanos_s2_03_blur.jpg" /> },
  { key: "clip_356467", start: 356.46666666666664, dur: 4.766666666666667, tin: "push", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p05.mp4" rate={1} /> },
  { key: "componente_361233", start: 361.23333333333335, dur: 9, tin: "iris", tout: "cut", ov: 10, el: (d) => <SceneCallout durationInFrames={d} {...({"bg":"img/lupeanos_s7_03.jpg","at":[50,55],"kicker":"CUÉNTAME","label":"¿Cuántos años tienes?","sub":"¿Qué es lo mejor de tu edad?","bed":"img/lupeanos_s7_01_blur.jpg"} as any)} /> },
  { key: "avatar_370233", start: 370.23333333333335, dur: 4.6, tin: "wipe", tout: "cut", ov: 10, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w015.mp4" seed={11107} durF={d} bed="img/lupeanos_s2_03_blur.jpg" /> },
  { key: "imagen_374833", start: 374.8333333333333, dur: 7.6, tin: "wipe", tout: "cut", ov: 10, el: (d) => <Foto src="img/lupeanos_s1_04.jpg" seed={11245} durF={d} /> },
  { key: "clip_382433", start: 382.43333333333334, dur: 5.4, tin: "zoom", tout: "cut", ov: 10, el: (d) => <Clip src="broll/lupeanos_real/lupeanos_p28.mp4" rate={1} /> },
  { key: "avatar_387833", start: 387.8333333333333, dur: 8.066666666666666, tin: "wipe", tout: "cut", ov: 0, el: (d) => <RayAvatarWin src="broll/lupeanos/av_w016.mp4" seed={11635} durF={d} bed="img/lupeanos_s1_04_blur.jpg" /> },
];

export const OVERLAYS: Cue[] = [

];
